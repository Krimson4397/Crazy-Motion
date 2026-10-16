#!/usr/bin/env node
// capture.mjs — deterministic frame-by-frame capture for a seek-rendered motion page.
//
// Page contract (the page must expose these globals):
//   window.draw(frame)   draw exactly that frame; must be a pure function of the frame number.
//                        May be async. Never read the wall clock, never use Math.random.
//   window.FRAMES        integer total frame count
//   window.FPS           integer frame rate
//   window.CUES          optional array of seconds where shots cut (used by --sheet)
//
// Zero npm dependencies. Drives Chrome/Chromium over the DevTools Protocol using
// node's built-in fetch + WebSocket (node >= 22). Nothing to install.
//
// Usage
//   node capture.mjs page.html out.mp4                 full render (H.264, yuv420p, bt709)
//   node capture.mjs page.html out.mp4 --range 0:120   partial render (chunking / re-renders)
//   node capture.mjs page.html shot --stills 0,150,300 stills (bare frames, or 2.5s for seconds)
//   node capture.mjs page.html sheet.png --sheet 1     one frame every N seconds, tiled
//   node capture.mjs page.html hashes.json --hashes    per-frame PNG sha256 (determinism check)
//   node capture.mjs page.html out.mp4 --jpeg --crf 20 faster, lossy drafts
//   node capture.mjs page.html out.mp4 --audio score.wav --loudnorm
//
// Options: --range a:b, --jpeg, --crf N, --frames DIR, --audio FILE, --loudnorm,
//          --timeout MS (per-frame, default 30000), --quiet, --chrome PATH
import { spawn, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, parse, format } from 'node:path';

// ---------- args ----------
const argv = process.argv.slice(2);
const flag = (name) => { const i = argv.indexOf(name); return i < 0 ? undefined : (argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true); };
const [pagePath, outArg] = argv;
const mode = flag('--stills') ? 'stills' : flag('--sheet') ? 'sheet' : flag('--hashes') ? 'hashes' : 'video';
if (!pagePath || !outArg) {
  console.error('usage: node capture.mjs page.html <out.mp4|out.png|hashes.json> [--stills f1,f2 | --sheet [sec] | --hashes] [--range a:b] [--jpeg] [--crf N]');
  process.exit(2);
}
const quiet = !!flag('--quiet');
const log = (...a) => { if (!quiet) console.log(...a); };
const perFrameTimeout = Number(flag('--timeout') || 30000);

// ---------- chrome ----------
function findChrome() {
  if (flag('--chrome')) return String(flag('--chrome'));
  if (process.env.CHROME) return process.env.CHROME;
  const cands = process.platform === 'win32'
    ? [process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
       'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
       'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
       'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe']
    : process.platform === 'darwin'
      ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
         '/Applications/Chromium.app/Contents/MacOS/Chromium',
         '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge']
      : ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge'];
  for (const c of cands) if (c && existsSync(c)) return c;
  return process.platform === 'win32' ? 'chrome.exe' : 'google-chrome'; // last resort: PATH
}
const chromePath = findChrome();

// ---------- minimal CDP client ----------
class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map(); this.waiters = new Map();
    ws.addEventListener('message', (ev) => {
      let m; try { m = JSON.parse(ev.data); } catch { return; }
      if (m.id && this.pending.has(m.id)) {
        const { res, rej } = this.pending.get(m.id); this.pending.delete(m.id);
        m.error ? rej(new Error(m.error.message)) : res(m.result);
      } else if (m.method) {
        for (const fn of (this.waiters.get(m.method) || [])) fn(m.params, m.sessionId);
      }
    });
  }
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    const p = new Promise((res, rej) => this.pending.set(id, { res, rej }));
    this.ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    return p;
  }
  once(method) { return new Promise((res) => { const fn = (p) => { this.waiters.set(method, (this.waiters.get(method) || []).filter((f) => f !== fn)); res(p); }; this.waiters.set(method, [...(this.waiters.get(method) || []), fn]); }); }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- launch ----------
const profile = mkdtempSync(join(tmpdir(), 'capture-profile-'));
const args = ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
  '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', '--hide-scrollbars',
  '--mute-audio', '--force-device-scale-factor=1', '--font-render-hinting=none'];
if (flag('--gl')) args.push('--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader');
args.push('about:blank');

const child = spawn(chromePath, args, { stdio: ['ignore', 'ignore', 'ignore'], windowsHide: true });
let browserWs = null;
// On Windows, chrome.exe is a GUI-subsystem binary: it prints nothing to inherited
// pipes, so parse-from-stderr does not work. A fixed port + HTTP poll always does.
const port = Number(flag('--port') || (9300 + Math.floor(Math.random() * 500)));
args.unshift(`--remote-debugging-port=${port}`);
const wsReady = (async () => {
  for (let i = 0; i < 100; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (r.ok) {
        const j = await r.json();
        if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl;
      }
    } catch {}
    if (child.exitCode !== null) throw new Error(`chrome exited immediately (code ${child.exitCode}) — check --chrome: ${chromePath}`);
    await sleep(200);
  }
  throw new Error(`chrome did not open a DevTools port on ${port} in 20s (${chromePath})`);
})();
let cdp, sessionId, targetId;
async function shutdown(code) {
  try { if (cdp && targetId) await cdp.send('Target.closeTarget', { targetId }); } catch {}
  try { if (cdp) await cdp.send('Browser.close'); } catch {}
  try { child.kill(); } catch {}
  await sleep(120);
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
  process.exit(code || 0);
}
process.on('SIGINT', () => shutdown(130));

try {
  const url = await wsReady;
  const ws = new WebSocket(url);
  await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', () => rej(new Error('websocket to chrome failed'))); });
  cdp = new CDP(ws);
  ({ targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' }));
  ({ sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true }));
  await cdp.send('Page.enable', {}, sessionId);
  await cdp.send('Runtime.enable', {}, sessionId);
  const loaded = cdp.once('Page.loadEventFired');
  await cdp.send('Page.navigate', { url: 'file://' + resolve(pagePath).replace(/\\/g, '/') + '?render' }, sessionId);
  await Promise.race([loaded, sleep(15000)]);

  const prep = await cdp.send('Runtime.evaluate', {
    expression: `(async () => {
      // kill anything on the compositor clock: it drifts and does not exist in the render
      document.getAnimations && document.getAnimations().forEach(a => { try { a.cancel(); } catch {} });
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      const c = document.querySelector('canvas');
      return { FRAMES: window.FRAMES|0, FPS: window.FPS|0, CUES: window.CUES || null,
               w: c ? c.width : 0, h: c ? c.height : 0, hasDraw: typeof window.draw === 'function' };
    })()`, awaitPromise: true, returnByValue: true,
  }, sessionId);
  const info = prep.result.value || {};
  if (!info.hasDraw || !info.FRAMES || !info.FPS) {
    console.error('page contract not met: window.draw(frame), window.FRAMES and window.FPS are required', info);
    await shutdown(1);
  }
  if (!info.w || !info.h) { console.error('no <canvas> with a non-zero size found'); await shutdown(1); }
  if ((info.w % 2) || (info.h % 2)) console.error(`warning: canvas is ${info.w}x${info.h}; H.264 needs even width and height`);
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: info.w, height: info.h, deviceScaleFactor: 1, mobile: false }, sessionId);
  log(`${info.FRAMES} frames @ ${info.FPS}fps, canvas ${info.w}x${info.h}`);

  // ---------- frame grabbing ----------
  const mime = flag('--jpeg') ? 'image/jpeg' : 'image/png';
  const quality = flag('--jpeg') ? 0.95 : undefined;
  const grabExpr = (f) => `(async () => {
    await window.draw(${f});
    await new Promise(r => { let done = false; const t = setTimeout(() => { if (!done) { done = true; r(); } }, 100);
      requestAnimationFrame(() => requestAnimationFrame(() => { if (!done) { done = true; clearTimeout(t); r(); } })); });
    const c = document.querySelector('canvas');
    return c.toDataURL(${JSON.stringify(mime)}${quality ? ', ' + quality : ''}).split(',')[1];
  })()`;
  const grab = async (f) => {
    const r = await Promise.race([
      cdp.send('Runtime.evaluate', { expression: grabExpr(f), awaitPromise: true, returnByValue: true }, sessionId),
      sleep(perFrameTimeout).then(() => { throw new Error(`frame ${f} timed out after ${perFrameTimeout}ms`); }),
    ]);
    if (r.exceptionDetails) throw new Error(`frame ${f}: ${r.exceptionDetails.exception?.description || r.exceptionDetails.text}`);
    return Buffer.from(r.result.value, 'base64');
  };
  const [rStart, rEnd] = (() => {
    const r = flag('--range'); if (!r) return [0, info.FRAMES - 1];
    const [a, b] = String(r).split(':').map(Number);
    return [Number.isFinite(a) ? a : 0, Number.isFinite(b) ? b : info.FRAMES - 1];
  })();
  const out = outArg;
  const started = Date.now();

  if (mode === 'stills') {
    const spec = String(flag('--stills')).split(',').map((v) => v.trim());
    const frames = spec.map((v) => v.endsWith('s') ? Math.round(parseFloat(v) * info.FPS)
      : v.includes('%') ? Math.round((parseFloat(v) / 100) * (info.FRAMES - 1)) : Math.round(Number(v)))
      .filter((f) => Number.isFinite(f) && f >= 0 && f < info.FRAMES);
    for (const f of frames) {
      const p = `${out}-${String(f).padStart(4, '0')}.png`;
      writeFileSync(p, await grab(f)); log(`${p}  (t=${(f / info.FPS).toFixed(2)}s)`);
    }
  } else if (mode === 'sheet') {
    const every = flag('--sheet') === true ? 1 : Number(flag('--sheet'));
    const near = (t) => (info.CUES || []).find((c) => Math.abs(t - c) < 0.35);
    const frames = [];
    for (let t = every / 2; t * info.FPS < info.FRAMES; t += every) {
      const c = near(t);
      frames.push(Math.min(info.FRAMES - 1, Math.max(0, Math.round((c !== undefined ? c + 0.45 : t) * info.FPS))));
    }
    const cols = Math.ceil(Math.sqrt(frames.length));
    const rows = Math.ceil(frames.length / cols);
    const tileW = 360, tileH = Math.round((info.h / info.w) * tileW);
    const b64 = await cdp.send('Runtime.evaluate', { awaitPromise: true, returnByValue: true, expression: `(async () => {
      const frames = ${JSON.stringify(frames)}, FPS = ${info.FPS};
      const src = document.querySelector('canvas');
      const c = document.createElement('canvas'); c.width = ${cols} * ${tileW}; c.height = ${rows} * ${tileH};
      const x = c.getContext('2d'); x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height);
      const s = Math.round(${tileW} / 16);
      for (let i = 0; i < frames.length; i++) {
        const f = frames[i];
        await window.draw(f);
        const ox = (i % ${cols}) * ${tileW}, oy = Math.floor(i / ${cols}) * ${tileH};
        x.drawImage(src, 0, 0, src.width, src.height, ox, oy, ${tileW}, ${tileH});
        x.fillStyle = 'rgba(0,0,0,.65)'; x.fillRect(ox, oy, s * 3.4, s * 1.4);
        x.fillStyle = '#fff'; x.font = '700 ' + Math.round(s * .85) + 'px monospace'; x.textBaseline = 'middle';
        x.fillText((f / FPS).toFixed(2) + 's', ox + s * .3, oy + s * .72);
      }
      return c.toDataURL('image/png').split(',')[1];
    })()` }, sessionId);
    writeFileSync(out, Buffer.from(b64.result.value, 'base64'));
    log(`contact sheet: ${frames.length} frames (every ${every}s) -> ${out}`);
  } else if (mode === 'hashes') {
    const hashes = [];
    for (let f = rStart; f <= rEnd; f++) { hashes.push(createHash('sha256').update(await grab(f)).digest('hex').slice(0, 16)); }
    writeFileSync(out, JSON.stringify({ fps: info.FPS, frames: info.FRAMES, range: [rStart, rEnd], hashes }, null, 0));
    log(`hashes ${rStart}-${rEnd} -> ${out}`);
  } else {
    const ext = parse(out).ext ? out : out + '.mp4';
    const enc = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-vcodec', mime === 'image/png' ? 'png' : 'mjpeg',
      '-framerate', String(info.FPS), '-i', '-', '-vf', 'scale=in_range=pc:out_range=tv',
      '-c:v', 'libx264', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-crf', String(flag('--crf') || 18),
      '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-color_range', 'tv',
      '-movflags', '+faststart', ext];
    const framesDir = flag('--frames');
    const ff = spawn('ffmpeg', enc, { stdio: ['pipe', 'inherit', 'inherit'] });
    const closed = new Promise((r) => ff.on('close', (c) => r(c)));
    ff.on('error', (e) => { console.error('ffmpeg failed to start:', e.message); process.exit(1); });
    ff.stdin.on('error', () => {});
    if (framesDir) mkdirSync(framesDir, { recursive: true });
    for (let f = rStart; f <= rEnd; f++) {
      const buf = await grab(f);
      if (framesDir) writeFileSync(join(framesDir, `f${String(f).padStart(5, '0')}.png`), buf);
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
      if (!quiet && f % (info.FPS * 5) === 0) log(`frame ${f}/${rEnd}`);
    }
    ff.stdin.end();
    const code = await closed;
    if (code !== 0) { console.error(`ffmpeg exited with code ${code}; ${ext} is incomplete`); await shutdown(1); }
    if (flag('--audio')) {
      const audio = String(flag('--audio'));
      const silent = ext.replace(/\.mp4$/, '.silent.mp4');
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', ext, '-i', audio, '-c:v', 'copy',
        ...(flag('--loudnorm') ? ['-af', 'loudnorm=I=-14:TP=-1:LRA=11'] : []),
        '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-shortest', silent]);
      rmSync(ext); execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', silent, '-c', 'copy', ext]); rmSync(silent);
      log(`audio muxed: ${audio}`);
    }
    const secs = (rEnd - rStart + 1) / info.FPS, wall = (Date.now() - started) / 1000;
    log(`rendered ${rEnd - rStart + 1} frames @ ${info.FPS}fps (${secs.toFixed(2)}s) -> ${ext}`);
    log(`wall ${wall.toFixed(1)}s (${(wall / secs).toFixed(2)}s per second of film)`);
    log(`verify: ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames,width,height,r_frame_rate,pix_fmt,color_range -of default=nw=1 ${ext}`);
  }
} catch (err) {
  console.error('capture failed:', err.message);
  await shutdown(1);
}
await shutdown(0);
