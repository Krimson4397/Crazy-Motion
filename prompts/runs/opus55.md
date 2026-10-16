## 00. MODEL OF A GREAT RESULT

A senior motion designer and an average AI agent can use the same tools and produce frames that look identical as stills. The difference shows up over time. Here are the five highest-leverage differences, most important first.

1. **One thing moves at a time, and everything else waits for it.** In the average agent's output, every element animates on load. In senior work, each 0.5–1.0s window has exactly one primary mover, at most two secondary movers that react to it, and ambient motion under ~10% amplitude. The viewer's eye can track one primary object. Animating a second competing object at equal amplitude halves the read of both.

2. **Timing is asymmetric and scaled to what is moving.** The average agent uses one duration (often 0.5s) and one ease-in-out curve for everything. A senior designer accelerates out of rest fast and spends 60–75% of the duration settling. Duration grows with travel distance (roughly with its square root), exits are shorter than entrances, and big objects take longer than small ones.

3. **Actions overlap.** In the average agent's output, A finishes, then B starts. In senior work, B starts when A is 60–80% complete, so no two elements start or stop on the same frame unless the sync is deliberate (a beat hit). Without this overlap, motion reads as a list of events. With it, motion reads as one gesture.

4. **Holds are designed, not left over.** Text stays on screen long enough to read: about 0.5s plus 0.3s per word for display copy. The end card holds at least 1.2s. Roughly 15–30% of runtime is near-still. The average agent either never stops moving or ends on the last action with no hold.

5. **Transitions carry meaning between shots.** A shared element, a matched velocity, or a matched eye position links shot A to shot B. The average agent puts a cross-dissolve or fade-through-black between unrelated scenes, which signals that nothing connects them. Restraint in surface treatment is a corollary: one accent hue, no glow unless it is the subject, and no gradient that exists only to fill space.

## 01. TIMING AND EASING

All values assume 60fps output; frame counts are in brackets.

**Default durations**

| Event | Duration |
|---|---|
| Text reveal, per line | 0.45–0.7s [27–42f]. Word stagger 40–70ms; character stagger 15–25ms, total spread capped at 0.6s |
| Object entrance, small/UI scale (<20% of frame) | 0.35–0.55s |
| Object entrance, hero/full-frame | 0.6–0.9s |
| Object exit | 60–75% of its entrance duration, typically 0.2–0.4s |
| Camera move, purposeful | 1.2–3.0s |
| Camera move, ambient drift | 4–10s, amplitude under 5% scale or 3% frame width |
| Scene transition (wipe, push, zoom-through) | 0.4–0.8s; whip transitions 0.12–0.2s |
| Hold before a cut | max(0.6s, 0.5s + 0.3s × words on screen). Logo/end card 1.2–2.0s |

**Distance scaling:** `t = t_base × sqrt(d / d_ref)`, where `d_ref` is about 25% of the frame width. Clamp the result to [0.6, 1.6] × `t_base`.

**Easing curves** (cubic-bezier control points, with the case each belongs to)

| Name | Control points | Case |
|---|---|---|
| Expo-out | (0.16, 1, 0.3, 1) | Hero entrances and large travel. Gives a decisive arrival with a long settle. My default for things arriving. |
| Quart-out | (0.25, 1, 0.5, 1) | Small and UI-scale entrances, text mask reveals. Less dramatic than expo. |
| Cubic in-out | (0.65, 0, 0.35, 1) | Objects relocating A→B while staying on screen. Camera moves between two rest positions. |
| Quart in-out | (0.76, 0, 0.24, 1) | Heavy, emphasised relocations and push transitions where both scenes move. |
| Sine in-out | (0.37, 0, 0.63, 1) | Loops, breathing, ambient drift. Low acceleration, so it never draws the eye. |
| Expo-in | (0.7, 0, 0.84, 0) | Exits. The object leaves at full velocity and the cut or the next element hides where it ends. |
| Back-out | (0.34, 1.56, 0.64, 1) | ~10% overshoot. One element per piece at most; reserve for a playful hero landing. |
| Linear | — | Continuous rotation, tickers, scroll, constant-velocity camera through a cut. Never for an object starting or stopping in frame. |

**Springs vs curves**

Use a spring when motion must be interruptible, when velocity must carry over from a previous motion, or for secondary follow-through (children lagging a parent). Use a curve when a landing must hit an exact frame, such as a beat.

My side of the practitioner disagreement: authored film pieces use curves for primary motion and springs for secondary motion. Interactive work uses springs for primary motion too.

Spring parameters, using damping ratio ζ and natural frequency f:

| Feel | ζ | f |
|---|---|---|
| No overshoot | 1.0 (critical) | 1.5–2.5 Hz |
| UI settle, barely perceptible overshoot | 0.75–0.85 | 2–3 Hz |
| Playful, single hero only | 0.4–0.55 | 1.5–2.5 Hz |

Settling time is about `4 / (ζ·ω)`, where `ω = 2πf`. Example: ζ=0.8 and f=2 Hz give about 0.4s. Underdamped position:

`x(t) = 1 − e^(−ζωt)·(cos(ω_d t) + (ζ/√(1−ζ²))·sin(ω_d t))`, where `ω_d = ω√(1−ζ²)`

To land a spring on a beat, compute its settling time and start it that far before the beat.

**Stagger**

- Per-item delay: `delay = min(60ms, W / (n−1))`, where the total window W is 0.4–0.6s.
- Above 12 items, stop staggering individuals. Stagger by group, or by distance from a cause point: `delay = k × distance`, with k set so the farthest item starts at W.
- Distribute the offsets themselves with an ease-out, so early items separate more and late items bunch together. The wave then reads as decelerating, not mechanical.
- Direction follows the cause: radiate from the point of origin of the action. If there is no cause point, follow reading direction (top-left to bottom-right in LTR scripts).

**Concurrent motion budget:** one primary mover, up to two secondary movers, unlimited ambient motion if each piece stays under 10% of its size in amplitude and under 0.5 Hz.

## 02. PACING AND STRUCTURE

**5s piece (300f), 1–3 shots**

| Time | Purpose |
|---|---|
| 0–0.4s | Hook event |
| 0.4–3.5s | One idea, developed |
| 3.5–5.0s | Resolve, then hold at least 1.0s |

**10s piece (600f), 3–6 shots**

| Time | Purpose |
|---|---|
| 0–1.5s | Hook |
| 1.5–6s | Build, with escalating density or speed |
| 6–8s | Peak: fastest cut or largest move |
| 8–10s | Resolve and end card, holding at least 1.2s |

**30s piece, 8–15 shots, average shot 2–3.5s**

| Time | Purpose |
|---|---|
| 0–5s | Hook and premise |
| 5–22s | Development. Alternate short shots (0.8–1.5s) with long ones (3–5s); constant shot length is monotonous. |
| 22–27s | Climax |
| 27–30s | End card, 3–4s |

**Shot length:** target 1.5–3s. Cap at 4s for a mostly static shot, 6–8s for a continuous camera move with content evolving at least every 2s. Shots under 0.5s work only as a rhythmic flurry of 3 or more, or as a whip transition.

**Beat grid**

| Tempo | One beat | Default cut spacing |
|---|---|---|
| 100 BPM | 0.6s (36f) | Every 2 beats, 1.2s |
| 120 BPM | 0.5s (30f) | Every 2–4 beats, 1–2s |
| 140 BPM | 0.4286s (≈25.7f) | Every 4 beats, 1.71s. Cutting every beat at 140 exhausts the viewer within about 4s. |

- Cuts land on downbeats. Motion impacts land on beats as well, meaning the frame of contact or settle, not the start of the move.
- Place the visual hit 0–1 frame *before* the audio transient. Viewers tolerate late audio far more than early audio.
- Tolerable off-grid error is ±2 frames at 60fps (about 33ms) for cuts and ±1 frame for impacts. Deliberate syncopation on 8th or 16th notes is fine if it repeats; a single off-grid hit reads as a mistake.

**Stillness:** 15–30% of runtime may be near-still, including the end hold. A truly frozen frame (zero pixel change) longer than 1.5s reads as dead unless the viewer is reading. Add a 1–2% drift.

**First 1.5 seconds:** a clear focal point must exist by frame 18 (0.3s). The motion grammar (easing family, palette, speed) must be established by 1.0s. Something must be unresolved at 1.5s: a shape incomplete, a sentence half-written, a camera mid-move. A fade from black over 0.3s, or a logo first, wastes the hook.

## 03. COMPOSITION AND HIERARCHY

**Safe areas:** action-safe is the central 93%; title-safe is the central 90%. For 9:16 social, keep critical content out of the top ~14% and bottom ~20%, where platform UI overlays sit (medium confidence; platforms change). Margins are 5–8% of the short edge. Layout uses a 12-column or thirds grid; snap focal points to thirds intersections or the vertical centre line, never to neither.

**Focal points:** one per shot. A second is allowed only if the primary is at least 2× larger or carries the only accent colour.

**Empty frame:** 40–70% of the frame should be negative space for a reserved register. Below 25% reads as clutter unless density is the concept.

**Optical centring**

- Place the visual centre of mass 2–5% of frame height above geometric centre.
- Shift play/triangle glyphs 5–10% of their own width toward their point.
- Circles must be 2–4% larger than squares to read as equal size.
- Text blocks are centred on cap-height mid-line, not bounding box.

**Depth cues for motion, strongest first:**

1. Occlusion
2. Motion parallax (relative speed of layers)
3. Looming (size change over time)
4. Defocus blur
5. Atmospheric value falloff (distant layers 10–25% closer to background value)
6. Contact shadow
7. Texture gradient

**Where the eye lands in the first 300ms:** motion onset first, then the highest local luminance contrast, then faces, then text, then the largest isolated shape, then warm saturated hue.

Mechanisms that steer it: motion onset, value isolation, leading lines and pointing vectors, and eye-trace continuity. Across a cut, keep the new focal point within ~10–15% of frame width of where the old one was, unless the jump itself is the point.

## 04. COLOR, LIGHT AND TYPE

**Palette construction** (OKLCH; L is 0–1, C is chroma)

- **Hues:** 2–3 hues total plus neutrals: one dominant hue for tinted neutrals, one secondary, one accent.
- **Neutrals:** C 0.005–0.02, tinted toward the dominant or accent hue. Pure C=0 grey reads inert.
- **Accent:** C 0.12–0.20.
- **Background:** L 0.12–0.20 for dark, 0.95–0.98 for light. Avoid pure #000/#FFF. Off-black gives highlights room and survives YUV export better.
- **Value separation:** the primary subject differs from the background by ΔL ≥ 0.35; secondary elements by ΔL ≥ 0.2; ambient elements by ΔL ≤ 0.1.
- **Accent area:** 5–10% of frame area (the 60/30/10 split), and one accent per frame.

**Gradients**

- Interpolate in OKLab or OKLCH so the midpoint doesn't go muddy.
- A background gradient spans ΔL ≤ 0.08 and hue shift ≤ 30°.
- Add 0.5–1.5% luminance noise or dither, so 8-bit export does not band.

**Glow**

- Bloom applies only to pixels above L 0.85.
- Halo radius stays ≤ 2–4% of frame height.
- At most one glowing element per shot. Glow is a light source, not a decoration.

**Lighting:** key light from 30–45° above the subject. On dark backgrounds, give dark subjects a rim light with ΔL ≥ 0.25 against the background.

**Type**

- **Size:** headline 6–9% of frame height (65–100px at 1080p); subhead 3–4%; ratio between levels 1.5–2×.
- **Tracking:** −1% to −3% of em on display sizes; +5% to +12% on small caps and labels; 0 at body size.
- **Weights:** at most two per piece.
- **Line length:** ≤ 6–8 words per line on screen, ≤ 2 lines per shot. More than that means split the shot.

**Animation unit**

| Unit | Case |
|---|---|
| Line | Sentences over 6 words |
| Word | Headlines of 2–6 words, kinetic emphasis |
| Character | Single words of 12 characters or fewer only |

Mask reveal: the text rises 100–110% of line height from a clipped baseline using quart-out, with opacity 0→1 over the first 40% of the move.

Practitioners disagree on per-character animation. My side: avoid it for anything readable beyond one word, because it delays comprehension by the full stagger spread.

## 05. CAMERA LANGUAGE

**Push-in: importance, intimacy.**
- 5–15% scale over 2–4s.
- A dolly (camera moves, perspective changes, layers parallax) reads as physical; a zoom (FOV narrows, perspective flattens) reads as observational or surveillance. Default to dolly.

**Pull-out: reveal context, end a sequence.**
- 10–30% over 2–4s. Strongest when the revealed context changes the meaning of the subject.

**Orbit: show volume.**
- 15–45° over 2–4s.
- More than 90° in under 2s disorients.
- Pivot slightly in front of the object's centre, not exactly at it, so the background slides more than the subject.

**Whip pan: energy, and a transition carrier.**
- 7–12 frames at 60fps.
- Heavy directional blur.
- Hide the cut at peak velocity.

**Parallax (2.5D): depth without 3D.**
- Layer speed ratios: background 0.2, midground 0.5, subject 1.0, foreground 1.3–1.6.
- Foreground elements are defocused.

**Rack focus: transfers attention between planes without moving the frame.**
- 0.5–1.0s, cubic in-out.
- Blur radius at the defocused plane ≥ 1.5% of frame height, or the change does not read.

**Handheld: presence and urgency.**
- Layered noise at 0.5–2 Hz.
- Translation amplitude 0.2–0.5% of frame, rotation 0.1–0.3°.
- Never pure single-frequency sine.

**Essential moves missing from the list:**
- **Crane/pedestal:** vertical reveal, status.
- **Truck/track:** lateral follow, keeps the subject's screen position while the world slides.
- **Lock-off:** static. Confidence; lets the subject do the moving.
- **Dutch roll of 3–10°:** unease.
- **Dolly-zoom:** vertigo. Rare, once per piece at most.
- **Snap zoom:** comic or urgent emphasis, 4–6 frames.

**Chaining two moves**
- Either match velocity at the boundary (move 1 never fully stops; move 2 inherits its speed and direction), or decelerate to under 10% speed before reversing.
- Never reverse direction at full speed, except as a whip.
- Overlap the second move's start with the last 20–30% of the first.

**Making browser 3D read as a camera, not a viewport**
- Vertical FOV 25–40° (roughly 35–55mm full-frame equivalent), not 60–75°.
- Camera target leads camera position by 0.1–0.2s via a damped follow, so the camera feels operated.
- Roll 0.5–2° into lateral moves (banking).
- Shallow depth of field, focus on the subject.
- Motion blur from the shutter.
- 10–20% corner vignette; 1–2% barrel distortion optional.
- A horizon or ground plane with contact shadows.
- No constant-velocity orbits around the origin.

**Motion tolerance at each speed**
- At 24fps with a 180° shutter, pans faster than one frame-width in about 7s begin to judder. This is a rule of thumb I recall from cinematography practice; medium confidence.
- At 60fps, about 1 frame-width per second is comfortable.
- Text stays readable while moving under ~10–15% of frame width per second.
- Above ~3 frame-widths per second, content reads only as blur. Use that speed only for transitions.

## 06. BANNED

1. **Every element on the same ease-in-out and the same 0.4–0.6s duration.** Reads as a template with no direction. Replace with a duration scaled to distance and role, and an ease from the table matched to entrance, exit, or relocation.
2. **Everything entering at once on load.** No hierarchy. Replace with a primary-first sequence and staggered secondaries at 40–70ms.
3. **Scale from 0 → 1 pop-in.** Objects materialising from nothing. Replace with scale 0.92–0.96 → 1, translate 8–24px, and opacity.
4. **Elastic/bounce overshoot on every element.** Overshoot loses meaning when it is universal. Replace with one back-out per piece; everything else expo- or quart-out.
5. **Purple-blue-pink diagonal gradient background.** The single most recognisable synthetic-default surface. Replace with a tinted neutral at C ≤ 0.02 and one accent.
6. **Neon glow and bloom on all edges.** Kills value hierarchy. Replace with glow only above L 0.85 on one element.
7. **Floating particles and bokeh dust as filler.** Motion with no cause dilutes the primary mover. Replace with nothing, or a single 2–3% grain layer.
8. **Glassmorphism on every surface.** Blur stacks muddy contrast and band on export. Replace with solid surfaces separated by ΔL ≥ 0.06.
9. **Typewriter text with blinking cursor outside terminal contexts.** A cliché that delays reading. Replace with a word-level mask reveal.
10. **Per-character fade on full sentences.** Comprehension delayed by the stagger spread. Replace with line-level reveal.
11. **3D object on a constant-speed turntable as the only motion.** Viewport, not camera. Replace with a 15–45° orbit, eased, with the pivot offset.
12. **Infinite sine hover-bob on all elements.** Constant ambient noise. Replace with stillness; bob only one idle hero at ≤ 1% amplitude.
13. **Linear easing on objects that start or stop in frame.** Robotic. Replace with an ease.
14. **Ken Burns zoom on every shot.** Motion as a crutch. Replace with lock-offs alternating with deliberate moves.
15. **Fade through black between every shot.** Signals disconnection and kills momentum. Replace with a cut, match cut, or push.
16. **Cross-dissolve as the default transition.** Two images at 50% read as neither. Replace with a hard cut on the beat.
17. **Default 75° FOV perspective camera.** Distorts the edges; reads as a game viewport. Replace with 25–40° vertical FOV.
18. **Text stacked with drop shadow, outline and gradient fill.** Three treatments fighting. Replace with a flat fill and value separation from the background.
19. **One font at one weight with uniform tracking at every size.** No typographic hierarchy. Replace with two weights, size ratio 1.5–2×, and tracking adjusted per size.
20. **Dead-centre symmetric composition in every shot.** Monotony. Replace with alternating thirds and centre, chosen per shot.
21. **Lens flares.** A dated signal of effect-for-its-own-sake. Replace with a single light sweep across a surface, if any.
22. **Fast motion without motion blur.** Strobing. Replace with a 180° shutter, 8–16 subframes.
23. **Pure #000 or #FFF with fully saturated RGB accents.** Crushed in YUV, and the accents vibrate. Replace with off-black, accent C ≤ 0.2.
24. **Banding in dark gradients.** 8-bit quantisation. Replace with dither noise or 10-bit export.
25. **Ending on the final action with no hold, or fading out the end card.** The message never lands. Replace with an end hold of at least 1.2s, then a cut.
26. **Screen shake on every impact.** Desensitises. Replace with shake on the single biggest hit, 4–8 frames, decaying.
27. **Counters jittering in width.** Proportional digits. Replace with tabular figures and an ease-out count.
28. **Mixed icon stroke weights and corner radii from different libraries.** Breaks family. Replace with one stroke weight, one radius.
29. **Hue cycling or rainbow animation.** No palette discipline. Replace with a fixed palette, with a value or chroma shift for emphasis.
30. **Sparkle/star glyphs as decoration.** Now read as a synthetic-content signifier. Replace with nothing.
31. **Grids of cards all flipping or spinning simultaneously.** No primary. Replace with a distance stagger from a cause point.
32. **Blur-in "word swap" headline loops.** A tired kinetic-type template. Replace with a mask reveal plus a hard swap on the beat.

## 07. MECHANISMS

**1. Mask line reveal**
- What: text or an object rises from a clipped edge.
- Use: headlines and copy.
- Fails when: the mask edge is visible, or the travel is too short to read as rising.
- Trick: travel 100–110% of line height, quart-out 0.5–0.7s, opacity on the first 40% only, mask box padded 10% below the descenders.

**2. Shared-element transform (FLIP)**
- What: an element in shot A becomes an element in shot B by interpolating position, scale, and radius.
- Use: connecting scenes.
- Fails when: the aspect ratio changes and content stretches.
- Trick: animate the container; counter-scale the content by the inverse; cubic in-out 0.5–0.8s; fade in new content only after 60%.

**3. Whip-pan cut**
- What: two shots joined by a fast pan.
- Use: energy changes, location jumps.
- Fails when: the blur is too weak and the cut is visible.
- Trick: 4–6 frames accelerating out of A, cut at peak, 4–6 frames decelerating into B. Directional blur ≥ 10% of frame width at peak. Both halves pan the same direction.

**4. Match-on-action cut**
- What: cut mid-action; the action completes in the new framing.
- Use: changing scale while keeping continuity.
- Fails when: the action restarts.
- Trick: cut at about 30–40% of the action; overlap 1–3 frames of motion so the action reads continuous.

**5. Velocity-matched cut**
- What: a moving element exits at velocity v; the new shot opens with motion at the same v and direction.
- Use: any cut during motion.
- Fails when: speeds differ by more than ~30%, which reads as a stutter.
- Trick: measure screen-space px per frame at the last frame of A and set the same on the first frame of B.

**6. Push transition**
- What: the incoming scene shoves the outgoing scene off-frame.
- Use: sequential content.
- Fails when: the two scenes move at different speeds and a gap opens.
- Trick: both scenes are one strip translating together; quart in-out 0.5–0.7s; add a 1px seam or a value step so the edge reads.

**7. Zoom-through**
- What: scale into a detail that becomes the next scene.
- Use: going "inside" an idea.
- Fails when: pixels upscale and soften.
- Trick: scale exponentially, `s(t) = s0 × (s1/s0)^ease(t)`, not linearly, so the zoom feels constant-speed. Swap to the next scene's vector or high-resolution layer at the moment the detail fills ~120% of frame.

**8. Shape wipe / iris**
- What: a geometric mask reveals the next scene.
- Use: graphic and branded transitions.
- Fails when: the shape origin is arbitrary.
- Trick: the origin is the previous focal point. Expo-out 0.5s. The mask radius must reach the frame's diagonal distance from the origin, not half-width.

**9. Stroke draw-on**
- What: a path draws itself.
- Use: lines, diagrams, signatures.
- Fails when: speed varies with path curvature, or caps pop.
- Trick: animate dash offset over the arc-length-normalised path. Duration 0.4s per 50% of frame width. Round caps, appearing only after the first 2px.

**10. Distance stagger from a cause point**
- What: elements react in a wave radiating from an origin.
- Use: grids, particles, letters.
- Fails when: the origin isn't visible, so the wave has no cause.
- Trick: delay = k × distance, k chosen so the farthest item starts at 0.4–0.6s; the origin event happens 1–2 frames before the first item reacts.

**11. Noise-threshold dissolve**
- What: a scene breaks up through a noise field.
- Use: organic transitions, material change.
- Fails when: soft edges look like a cross-dissolve.
- Trick: a hard threshold with a thin emissive edge.

```glsl
float n = fbm(uv * 4.0);                 // 0..1 noise
float e = 0.03;                          // edge width
float m = smoothstep(t - e, t, n);       // t: 0→1 eased
vec3 edge = accent * (smoothstep(t - e, t, n) - smoothstep(t, t + e, n)) * 2.0;
color = mix(sceneB, sceneA, m) + edge;
```

**12. Parallax layer stack**
- What: flat layers at different speeds.
- Use: 2.5D depth.
- Fails when: the ratios are wrong and layers feel glued, or edges are exposed.
- Trick: speed ratios 0.2 / 0.5 / 1.0 / 1.4. Overscan each layer by (camera travel × ratio) + 5%. Blur 0–3% on the foreground.

**13. Squash and stretch on impact**
- What: deformation that sells mass.
- Use: landings and hits.
- Fails when: volume changes and the object balloons.
- Trick: `sx = 1/√sy`. Impact sy 0.75–0.85 for 2–4 frames, recover with a spring at ζ 0.5. Stretch along the velocity vector before impact, 1.1–1.25.

**14. Follow-through / overlapping action**
- What: children lag the parent and settle after it stops.
- Use: anything with parts, such as text lines under a title.
- Fails when: the lag is identical on every child.
- Trick: each child follows a critically damped or ζ 0.7 spring on the parent's position. Lag increases 15–30ms per level of hierarchy.

**15. Anticipation**
- What: a small counter-move before the main move.
- Use: hero actions.
- Fails when: it is too large, which looks indecisive, or applied to UI.
- Trick: 5–10% of travel in the opposite direction over 80–150ms, then the main move on expo-out.

**16. Smear / velocity stretch**
- What: the object stretches along its velocity on fast frames.
- Use: stylised motion without real blur.
- Fails when: the object stretches while slow.
- Trick: stretch factor = 1 + clamp(speed_px_per_frame / object_size × 0.5, 0, 1.5), applied only when speed exceeds 25% of the object's size per frame.

**17. Specular light sweep**
- What: a highlight band crosses a surface.
- Use: materials, logos, "this is finished" beats.
- Fails when: the sweep is too bright, flat, or misaligned to geometry.
- Trick: band width 15–25% of the object, peak +0.15–0.25 L, 0.5–0.8s sine in-out, angle matched to the key light. Once per piece.

**18. Slice/split transition**
- What: the scene breaks into strips that move independently.
- Use: graphic punctuation on a beat.
- Fails when: there are too many slices and it reads as glitch.
- Trick: 3–7 slices, staggered 20–35ms, alternating direction, quart in-out 0.4s.

**19. SDF shape morph**
- What: one shape becomes another.
- Use: icon or logo transformations.
- Fails when: vertex-count mismatch makes paths tangle.
- Trick: interpolate signed distance fields, not vertices.

```glsl
float d = mix(sdA(p), sdB(p), ease(t));
float aa = fwidth(d);
float a = 1.0 - smoothstep(-aa, aa, d);
```

**20. Rack-focus attention shift**
- What: the focus plane moves between subjects.
- Use: directing the eye without a cut.
- Fails when: the blur radius is too small to register.
- Trick: defocus ≥ 1.5% of frame height. Pull 0.6–1.0s, cubic in-out. Drop the newly unfocused subject's value 5–10% toward the background.

**21. Beat flash**
- What: a 1–2 frame luminance or colour inversion on a downbeat.
- Use: accents at most every 2 bars.
- Fails when: overused, or when it breaches photosensitivity limits.
- Trick: ΔL ≤ 0.3. Never more than 3 flashes per second.

**22. Seamless loop closure**
- What: a loop whose last frame flows into its first.
- Use: idle states, social loops.
- Fails when: there is a velocity discontinuity at the seam.
- Trick: every periodic parameter's period divides the loop length exactly. Phase-based motion `p(t) = f(2πt/T)`. Never ease-in-out a loop; there is no rest point.

**23. Masked portal**
- What: the next scene is visible inside a shape within the current scene, which then expands.
- Use: foreshadowing, nested ideas.
- Fails when: the portal content is static.
- Trick: the portal content moves with slight counter-parallax (−0.2×) against the outer camera, so it reads as a window with depth.

**24. Layout reflow**
- What: on-screen elements re-arrange when one is added or removed.
- Use: lists, UI demonstrations.
- Fails when: everything moves at once.
- Trick: the displaced items move first (0.3s, cubic in-out); the new item enters 100–150ms later.

## 08. RENDER AND EXPORT REALITY

**Determinism**
- Time is derived only from `t = frameIndex / fps`, never from wall clock or rAF deltas.
- Seed every random generator.
- Run physics and springs on a fixed substep (1/240s), sampled at frame times.
- Disable any real-time CSS transition or animation; they run on the compositor clock and drift.
- Never screen-record a live page. Capture frame by frame.

**Motion blur**
- Default shutter angle is 180°, an exposure of 0.5 frame (1/120s at 60fps).
- 90° looks staccato and crisp; 270–360° looks dreamy and smeary.
- Accumulate 8–16 subframes, 32 for whips. Average in linear light, not sRGB, or bright edges darken.
- Centre the shutter interval on the frame time (−0.25 to +0.25 frame) so blur doesn't lag the object.

**Fonts**
- Wait for every font face and weight to finish loading before frame 0.
- Verify metrics. A fallback-font frame that lasts even one frame is a visible pop.

**Timing drift**
- Use integer frame rates (60, 30, 24), never 59.94 or 29.97, unless a broadcast deliverable requires them.
- Audio at 48 kHz is 800 samples per frame at 60fps. Sync on sample counts.
- AAC encoders add priming delay of about 1024 samples (~21ms). Check sync on the encoded file, not the timeline.

**Colour**
- Render sRGB; tag the output as BT.709 primaries, transfer and matrix.
- Browsers render full range (0–255); H.264 yuv420p is limited range (16–235). A missing or mismatched range flag produces washed-out greys or crushed blacks.
- 4:2:0 chroma subsampling smears saturated red or blue edges under 2px. Avoid thin saturated strokes on contrasting hues.
- Test on at least one player that applies a gamma shift (some desktop players have historically displayed Rec.709 files brighter).

**Codec and bitrate**
- Master: ProRes 422 HQ, or a lossless image sequence.
- Delivery: H.264 High profile, yuv420p, CRF 16–18, keyframe every 1–2s, moov atom at the front.
- 1080p60 at 12–20 Mbps for upload. Gradient-heavy or grain-heavy pieces need 25–50 Mbps or 10-bit HEVC.
- Grain and noise eat bitrate. Keep grain ≤ 2% amplitude, or it becomes macroblocks.

**Aliasing**
- Render at 2× and downscale with a Lanczos or area filter, or use 4× MSAA.
- Lines ≥ 1.5px at 1080p.
- Device pixel ratio must be fixed in the render context, or the output resolution silently halves.

**Audio**
- 48 kHz, AAC 256–320 kbps.
- Social and streaming target −14 LUFS integrated; broadcast −23 LUFS (EBU R128) or −24 LKFS (ATSC A/85).
- True peak ≤ −1 dBTP.
- Sync tolerance: audio may lag picture by about 100ms before detection, but leading picture is noticed at about 45ms. Bias visual hits early.

## 09. COMPILING A VAGUE BRIEF

**Procedure** for "show me how good a motion designer you are", with no further input:

1. **Decode the brief.** It is a capability demo; the audience is judging craft, not content. Success means the viewer infers intent in every frame within 10s.
2. **Pick one throughline.** One object transformed through every shot. A montage of unrelated effects reads as a template showcase.
3. **Write a 6–8 word statement** to give the text a purpose.
4. **Build the palette** by the section 04 rules: tinted dark neutral, off-white, one accent.
5. **Fix tempo** so the duration is a whole number of bars: 120 BPM gives 10s = 20 beats = 5 bars of 4/4.
6. **Assign shots to bars.** Hook in bar 1, build in bars 2–3, peak at the bar 4 downbeat, resolve in bar 5.
7. **Give each shot one distinct mechanism**, linked to the next by a shared element or matched velocity.
8. **Write measurable success criteria.**

**Executed example: "One Line"** (10s, 60fps, 600 frames, 120 BPM, a beat every 30 frames)

*Concept:* a single vermilion line becomes everything on screen. Statement: "Every frame / is a decision."

*Palette:*

| Role | Value |
|---|---|
| Background | oklch(0.16 0.012 250), blue-black |
| Primary | oklch(0.95 0.01 85), warm off-white |
| Accent | oklch(0.68 0.19 35), vermilion, ≤ 8% of frame area |
| Secondary | oklch(0.50 0.03 250) |

*Type:* one geometric or grotesque sans; headline 8% of frame height at weight 600, tracking −2%; subhead 3.5%.

**Shot 1 — f0–90 (0–1.5s). Hook: drop, squash, draw-on.**
- f0–8: a vermilion dot (2.5% of frame height) falls from above frame on expo-in.
- Lands at frame-centre-left (thirds) at f8; squash sy 0.78 / sx 1.13 for 3 frames; spring recovery ζ 0.5, f 2.5 Hz, settled by f30 (beat 1).
- Beat-1 anticipation: 4 frames left by 6px.
- f34–80: the dot shoots right, stroke draw-on, expo-out, extending to the right third line, with a velocity smear while fast.
- At f90 the line is complete and has become a baseline.
- Primary mover: the dot/line only.

**Shot 2 — f90–210 (1.5–3.5s). Mask reveal plus push-in.**
- f90 (beat 3): "Every frame" rises from behind the line, which now acts as the mask edge. Word-level stagger 60ms, quart-out 0.55s, 105% line-height travel.
- f90–210: camera push-in 6%, sine in-out (ambient tier).
- Hold from f135 to f210: 1.25s for 2 words, above the 1.1s minimum.
- Secondary: the line thickens 1→3px under the text over 0.4s.

**Shot 3 — f210–300 (3.5–5s). Whip-pan, then distance stagger.**
- f228–240: text and line whip left; cut at peak velocity at f240 (beat 8).
- f240–246: a 3×3 grid of off-white squares (6% frame height each) decelerates into frame at matched velocity.
- The line, still vermilion, enters as one square of the grid: the cause point.
- f246–280: the remaining squares rotate 90° via distance stagger from the vermilion square, k chosen so the farthest starts at 0.4s, each on quart-out.

**Shot 4 — f300–420 (5–7s). Peak: 3D fold, orbit, rack focus.**
- f300 (bar 3 downbeat): the grid folds along its seams into a cube, hinge rotations staggered 40ms, cubic in-out 0.6s, so the vermilion square becomes one face.
- Camera FOV 32° vertical; orbit 35° over f300–420 on cubic in-out, pivot offset 10% toward camera; roll 1.5° into the move.
- f360 (beat 12): peak frame; specular sweep across the vermilion face, 0.5s.
- f370–420: rack focus from cube to a background plane where faint secondary-colour grid lines become sharp; the cube defocuses to 2% of frame height.
- Motion blur 180°, 16 subframes.

**Shot 5 — f420–510 (7–8.5s). Zoom-through.**
- f420: the camera zooms through the vermilion face on exponential scale. At f468 the face fills 120% of frame; swap to a flat vermilion field.
- f480 (beat 16): beat flash with ΔL +0.2 for 2 frames.
- f480–510: the field contracts via an iris, its origin at the old face centre, expo-out, into a 3px vermilion line at the same baseline position as shot 1. Eye-trace continuity.

**Shot 6 — f510–600 (8.5–10s). End card.**
- f510 (beat 17): "is a decision." mask-reveals above the line, word stagger 60ms.
- "Every frame" re-enters on the line above at 3.5% size, secondary colour, 100ms later.
- f540–600: hold. 1.0s of complete stillness except 1% drift. An end hold of at least 1.2s is satisfied by counting the reveal settle from f530.
- No fade-out. Hard end.

**Success criteria** (all checkable on the render)
- One primary mover per 0.5s window, verified by frame-stepping.
- Every cut and impact lands within ±1 frame of a beat.
- Accent covers ≤ 10% of frame area outside f468–495.
- Text holds meet reading time.
- No banned item present.
- No banding visible in the 8-bit export at 200% zoom.
- The exported file plays in sync within 20ms.

## 10. SELF-AUDIT AND BLIND SPOTS

**Where my taste comes from.** Probably overwhelmingly from text: web and UI motion writing, CSS easing culture, motion-graphics tutorials, the classic animation principles, film editing and cinematography texts, and design-community critique from roughly 2015–2025. I have absorbed far more writing *about* motion than frame-level observation of motion. That biases me toward rules that are easy to state.

**Widely shared craft, high agreement:**
- Ease-out for entrances and ease-in for exits.
- Overlapping action, anticipation, squash with volume preservation.
- Safe areas and reading-time holds.
- A 180° shutter, linear-light blur accumulation, deterministic frame time.
- Loudness standards (−14 / −23 LUFS, −1 dBTP).
- A single focal point per shot.

**My preferences, presented as rules:**
- Expo-out as the default entrance. Strongly fashionable in current web motion, and likely to date.
- Dark tinted-neutral palettes and a single accent: a reserved, Swiss-modernist register.
- Hostility to per-character animation and to gradients.
- Exponential zoom.
- 60fps as the default. Many directors prefer 24fps with blur for a filmic feel.

**Claims I suspect are wrong, imprecise, or local:**
- **Stagger values (40–70ms) and the 0.4–0.6s stagger window:** plausible, but derived from UI convention, not tested on film-scale frames.
- **Social safe-area percentages:** platform UIs change.
- **The 7-second pan rule at 24fps:** recalled imprecisely.
- **Audio sync tolerances:** correct in direction; exact numbers are medium confidence.
- **The banned list:** reflects what reads as cheap to a Western design-industry eye now. In several regional advertising cultures (some South Asian, East Asian, and Latin American markets), high saturation, density, and bounce read as energy and celebration, not cheapness.
- **Left-to-right reading direction:** assumed throughout. RTL scripts invert stagger and transition direction.

**What I would need to see rendered to check myself:**
- A/B renders of the same shot with expo-out vs cubic-out vs a spring.
- Stagger sweeps at 30/50/80ms with 5, 10, and 20 items.
- 8-bit vs 10-bit gradient exports viewed on phones.
- Beat-sync tests at −2 to +4 frames, shown to viewers.
- 24 vs 60fps versions of the "One Line" piece.
- Eye-tracking or first-fixation data on 300ms frames.

## 11. RULES AS DATA

```json
[
{"id":"TM-01","category":"timing","rule":"Allow exactly one primary mover per 0.5–1.0s window; secondary movers react to it.","numbers":"1 primary, ≤2 secondary","confidence":"high","evidence":"inferred","falsified_if":"A shot with two equal-amplitude primary movers tests as equally readable as one with a single primary."},
{"id":"TM-02","category":"timing","rule":"Make exits shorter than entrances.","numbers":"exit = 0.6–0.75 × entrance","confidence":"high","evidence":"observed","falsified_if":"Exits matching entrance duration read as tighter in side-by-side renders."},
{"id":"TM-03","category":"timing","rule":"Scale move duration with the square root of travel distance, clamped.","numbers":"t = t_base·sqrt(d/0.25W), clamp 0.6–1.6×t_base","confidence":"medium","evidence":"inferred","falsified_if":"Fixed-duration moves across varying distances read as more consistent than scaled ones."},
{"id":"TM-04","category":"timing","rule":"Use 0.35–0.55s for small-object entrances and 0.6–0.9s for full-frame hero entrances.","numbers":"0.35–0.55s; 0.6–0.9s","confidence":"medium","evidence":"inferred","falsified_if":"Hero entrances under 0.5s read as weighty and deliberate."},
{"id":"TM-05","category":"timing","rule":"Hold on-screen text for at least 0.5s plus 0.3s per word before cutting.","numbers":"max(0.6s, 0.5+0.3·words)","confidence":"medium","evidence":"inferred","falsified_if":"Viewers reliably recall text held for less than this formula."},
{"id":"TM-06","category":"timing","rule":"Hold the end card or logo before the piece ends; never fade it out.","numbers":"1.2–2.0s","confidence":"high","evidence":"observed","falsified_if":"Pieces ending with a sub-0.5s end-card hold score equal brand recall."},
{"id":"TM-07","category":"timing","rule":"Start the next action when the previous one is 60–80% complete.","numbers":"20–40% overlap","confidence":"high","evidence":"observed","falsified_if":"Strictly sequential actions read as more fluid than overlapped ones."},
{"id":"TM-08","category":"timing","rule":"Cap total stagger spread so the last item starts within 0.6s of the first.","numbers":"delay=min(60ms, W/(n−1)), W 0.4–0.6s","confidence":"medium","evidence":"inferred","falsified_if":"A 1.2s stagger spread on 10 items reads as tighter than 0.5s."},
{"id":"TM-09","category":"timing","rule":"Above 12 items, stagger by group or by distance from a cause point, not per item.","numbers":"n>12","confidence":"medium","evidence":"guess","falsified_if":"Per-item index stagger on 30 items reads as clearly as distance stagger."},
{"id":"TM-10","category":"timing","rule":"Radiate stagger from the visible point that caused the reaction.","numbers":"delay = k·distance","confidence":"high","evidence":"inferred","falsified_if":"Index-order stagger reads as equally causal when a cause point is visible."},
{"id":"TM-11","category":"timing","rule":"Keep ambient motion under 10% of element size and under 0.5 Hz.","numbers":"<10% amplitude, <0.5Hz","confidence":"medium","evidence":"guess","falsified_if":"Ambient motion at 20% amplitude does not pull fixation from the primary."},
{"id":"EA-01","category":"easing","rule":"Use expo-out for hero entrances and long travel.","numbers":"cubic-bezier(0.16,1,0.3,1)","confidence":"medium","evidence":"inferred","falsified_if":"Viewers rate cubic-out hero entrances as more decisive than expo-out."},
{"id":"EA-02","category":"easing","rule":"Use quart-out for UI-scale entrances and text mask reveals.","numbers":"cubic-bezier(0.25,1,0.5,1)","confidence":"medium","evidence":"inferred","falsified_if":"Expo-out on small elements reads as less jumpy than quart-out."},
{"id":"EA-03","category":"easing","rule":"Use an in-out curve when an object relocates between two on-screen rest positions.","numbers":"cubic-bezier(0.65,0,0.35,1)","confidence":"high","evidence":"observed","falsified_if":"An ease-out-only relocation reads as smoother than in-out at equal duration."},
{"id":"EA-04","category":"easing","rule":"Use ease-in for exits leaving frame, so the object departs at full velocity.","numbers":"cubic-bezier(0.7,0,0.84,0)","confidence":"high","evidence":"observed","falsified_if":"Ease-out exits read as cleaner departures."},
{"id":"EA-05","category":"easing","rule":"Use sine in-out for loops, breathing and ambient drift.","numbers":"cubic-bezier(0.37,0,0.63,1)","confidence":"medium","evidence":"inferred","falsified_if":"Sine drift draws fixations as often as expo motion."},
{"id":"EA-06","category":"easing","rule":"Limit overshoot easing to one hero element per piece.","numbers":"back-out (0.34,1.56,0.64,1), ≤1 per piece","confidence":"medium","evidence":"inferred","falsified_if":"Pieces with universal overshoot are rated as equally professional."},
{"id":"EA-07","category":"easing","rule":"Never use linear easing for an object that starts or stops inside the frame.","numbers":"","confidence":"high","evidence":"observed","falsified_if":"Linear start/stop motion reads as natural in blind comparison."},
{"id":"EA-08","category":"easing","rule":"Use springs for interruptible motion and secondary follow-through; use curves for beat-locked primary motion.","numbers":"","confidence":"medium","evidence":"inferred","falsified_if":"Spring-driven primary moves hit beats as precisely as curves without manual tuning."},
{"id":"EA-09","category":"easing","rule":"For UI-settle springs, use damping ratio 0.75–0.85 at 2–3 Hz natural frequency.","numbers":"ζ 0.75–0.85, f 2–3Hz","confidence":"medium","evidence":"inferred","falsified_if":"ζ 0.5 springs on UI elements are rated as calmer."},
{"id":"EA-10","category":"easing","rule":"Start a beat-locked spring one settling time before the beat.","numbers":"ts ≈ 4/(ζ·2πf)","confidence":"medium","evidence":"inferred","falsified_if":"Springs started on the beat feel equally synced."},
{"id":"EA-11","category":"easing","rule":"Distribute stagger offsets with an ease-out, so early items separate more than late ones.","numbers":"","confidence":"low","evidence":"guess","falsified_if":"Uniform offsets read as more natural than eased offsets."},
{"id":"PA-01","category":"pacing","rule":"Establish a focal point by 0.3s and leave something unresolved at 1.5s.","numbers":"0.3s, 1.5s","confidence":"medium","evidence":"inferred","falsified_if":"Pieces opening with a 1s fade from black retain viewers equally."},
{"id":"PA-02","category":"pacing","rule":"Never open with a fade from black longer than 0.3s.","numbers":"≤0.3s","confidence":"medium","evidence":"inferred","falsified_if":"Long-fade openings test equal on early drop-off."},
{"id":"PA-03","category":"pacing","rule":"Target shot length 1.5–3s; cap static shots at 4s and evolving camera moves at 8s.","numbers":"1.5–3s target, 4s/8s caps","confidence":"medium","evidence":"inferred","falsified_if":"A 6s static shot holds attention as well as a 3s one."},
{"id":"PA-04","category":"pacing","rule":"Vary shot length; alternate short shots with long ones instead of a constant cadence.","numbers":"0.8–1.5s vs 3–5s","confidence":"medium","evidence":"inferred","falsified_if":"Constant 2s cuts read as equally dynamic over 30s."},
{"id":"PA-05","category":"pacing","rule":"Use 3–6 shots in a 10s piece, with the peak at 60–80% of runtime.","numbers":"3–6 shots, peak 6–8s","confidence":"medium","evidence":"inferred","falsified_if":"A peak at 30% of runtime reads as better structured."},
{"id":"PA-06","category":"pacing","rule":"Land cuts on downbeats, every 2–4 beats depending on tempo.","numbers":"120BPM=30f/beat at 60fps","confidence":"high","evidence":"observed","falsified_if":"Off-grid cuts read as equally musical."},
{"id":"PA-07","category":"pacing","rule":"Land the impact or settle frame on the beat, not the motion start.","numbers":"","confidence":"high","evidence":"observed","falsified_if":"Motion starts on the beat read as more synced than landings."},
{"id":"PA-08","category":"pacing","rule":"Place visual hits 0–1 frame before the audio transient.","numbers":"0–1 frame early","confidence":"medium","evidence":"inferred","falsified_if":"Visual hits 2 frames late feel more in sync than early ones."},
{"id":"PA-09","category":"pacing","rule":"Keep unintended off-grid error within ±2 frames for cuts and ±1 for impacts at 60fps.","numbers":"±33ms cuts, ±17ms impacts","confidence":"low","evidence":"guess","falsified_if":"Viewers fail to detect 4-frame errors."},
{"id":"PA-10","category":"pacing","rule":"At 140 BPM, do not cut every beat for more than 4 seconds.","numbers":"0.43s/beat, ≤4s","confidence":"low","evidence":"guess","falsified_if":"8s of per-beat cuts at 140 BPM is rated as not fatiguing."},
{"id":"PA-11","category":"pacing","rule":"Make 15–30% of runtime near-still, including the end hold.","numbers":"15–30%","confidence":"medium","evidence":"guess","falsified_if":"Pieces with zero holds rate as better paced."},
{"id":"PA-12","category":"pacing","rule":"Add 1–2% drift to any frozen frame longer than 1.5s unless the viewer is reading.","numbers":">1.5s, 1–2%","confidence":"low","evidence":"guess","falsified_if":"Fully frozen 3s frames feel alive in tests."},
{"id":"CO-01","category":"composition","rule":"Keep one focal point per shot; allow a second only if the primary is twice as large or carries the sole accent.","numbers":"1; 2× size","confidence":"high","evidence":"observed","falsified_if":"Two equal focal points are located faster than one."},
{"id":"CO-02","category":"composition","rule":"Keep critical content within title-safe, the central 90% of frame.","numbers":"90% title, 93% action","confidence":"high","evidence":"observed","falsified_if":"Content at 98% of frame survives all delivery players uncropped."},
{"id":"CO-03","category":"composition","rule":"In 9:16 social video, keep key content out of the top 14% and bottom 20%.","numbers":"14% top, 20% bottom","confidence":"low","evidence":"guess","falsified_if":"Platform UI does not overlap those bands on current apps."},
{"id":"CO-04","category":"composition","rule":"Leave 40–70% of the frame as negative space for a reserved register.","numbers":"40–70%, <25% = clutter","confidence":"medium","evidence":"inferred","falsified_if":"Frames with 15% negative space rate as equally premium."},
{"id":"CO-05","category":"composition","rule":"Place the visual centre 2–5% of frame height above geometric centre.","numbers":"2–5%","confidence":"medium","evidence":"observed","falsified_if":"Geometrically centred subjects read as centred, not low."},
{"id":"CO-06","category":"composition","rule":"Make circles 2–4% larger than squares meant to read as equal size.","numbers":"2–4%","confidence":"medium","evidence":"observed","falsified_if":"Equal-dimension circle and square read as equal size."},
{"id":"CO-07","category":"composition","rule":"Across a cut, place the new focal point within 10–15% of frame width of the old one.","numbers":"10–15% W","confidence":"medium","evidence":"inferred","falsified_if":"Cuts with 50% focal jumps are tracked as fast as continuous ones."},
{"id":"CO-08","category":"composition","rule":"Rank depth cues for motion as occlusion, parallax, looming, defocus, atmosphere, contact shadow.","numbers":"","confidence":"medium","evidence":"inferred","falsified_if":"Defocus alone produces stronger depth than motion parallax."},
{"id":"CO-09","category":"composition","rule":"Fade distant layers 10–25% toward the background value for atmospheric depth.","numbers":"10–25%","confidence":"medium","evidence":"inferred","falsified_if":"Equal-value layers read as equally deep."},
{"id":"CL-01","category":"color","rule":"Limit the palette to 2–3 hues plus tinted neutrals.","numbers":"2–3 hues","confidence":"medium","evidence":"inferred","falsified_if":"5-hue palettes rate as equally cohesive."},
{"id":"CL-02","category":"color","rule":"Tint neutrals toward the dominant hue rather than using zero chroma.","numbers":"OKLCH C 0.005–0.02","confidence":"medium","evidence":"inferred","falsified_if":"Pure grey neutrals rate as equally rich."},
{"id":"CL-03","category":"color","rule":"Separate primary subject from background by at least 0.35 in OKLCH lightness.","numbers":"ΔL ≥0.35 primary, ≥0.2 secondary","confidence":"medium","evidence":"inferred","falsified_if":"Subjects at ΔL 0.15 are found as fast."},
{"id":"CL-04","category":"color","rule":"Confine the accent colour to 5–10% of frame area, one accent per frame.","numbers":"5–10%","confidence":"medium","evidence":"inferred","falsified_if":"Accent at 30% area still directs fixation."},
{"id":"CL-05","category":"color","rule":"Use off-black or off-white backgrounds instead of pure #000/#FFF.","numbers":"L 0.12–0.20 or 0.95–0.98","confidence":"medium","evidence":"inferred","falsified_if":"Pure black exports with no crushing and rates as equal."},
{"id":"CL-06","category":"color","rule":"Interpolate gradients in OKLab/OKLCH, spanning at most 0.08 lightness and 30° hue.","numbers":"ΔL≤0.08, Δh≤30°","confidence":"medium","evidence":"inferred","falsified_if":"sRGB-interpolated gradients show no muddy midpoint."},
{"id":"CL-07","category":"color","rule":"Add dither noise to gradients for 8-bit delivery.","numbers":"0.5–1.5% luminance","confidence":"high","evidence":"observed","falsified_if":"8-bit dark gradients show no banding without dither."},
{"id":"CL-08","category":"color","rule":"Apply bloom only above lightness 0.85, to one element, with radius ≤4% frame height.","numbers":"L>0.85, ≤4% H","confidence":"medium","evidence":"guess","falsified_if":"Multi-element glow rates as equally premium."},
{"id":"TY-01","category":"type","rule":"Set headlines at 6–9% of frame height and step levels by 1.5–2×.","numbers":"6–9% H; ratio 1.5–2","confidence":"medium","evidence":"inferred","falsified_if":"4% headlines read as dominant at phone size."},
{"id":"TY-02","category":"type","rule":"Tighten display tracking and loosen small-caps tracking.","numbers":"−1 to −3% display; +5 to +12% labels","confidence":"high","evidence":"observed","falsified_if":"Default tracking at display size reads as equally tight."},
{"id":"TY-03","category":"type","rule":"Use at most two font weights per piece.","numbers":"≤2","confidence":"medium","evidence":"inferred","falsified_if":"Four-weight pieces rate as equally coherent."},
{"id":"TY-04","category":"type","rule":"Keep on-screen copy to 2 lines and 6–8 words per line per shot.","numbers":"≤2 lines, ≤8 words","confidence":"medium","evidence":"inferred","falsified_if":"3-line shots are read fully in normal hold time."},
{"id":"TY-05","category":"type","rule":"Animate by line for sentences over 6 words, by word for headlines, by character only for one short word.","numbers":">6 words line; ≤12 chars char","confidence":"medium","evidence":"inferred","falsified_if":"Per-character sentence reveals are read as fast as line reveals."},
{"id":"TY-06","category":"type","rule":"In mask reveals, travel 100–110% of line height with opacity on the first 40% only.","numbers":"100–110%; 40%","confidence":"medium","evidence":"inferred","falsified_if":"50% travel reveals read as clearly rising."},
{"id":"TY-07","category":"type","rule":"Use tabular figures for any animating number.","numbers":"","confidence":"high","evidence":"observed","falsified_if":"Proportional digits counting up show no width jitter."},
{"id":"CA-01","category":"camera","rule":"Push in 5–15% over 2–4s to signal importance.","numbers":"5–15%, 2–4s","confidence":"medium","evidence":"inferred","falsified_if":"A 3% push over 3s is consciously noticed."},
{"id":"CA-02","category":"camera","rule":"Prefer a dolly with parallax over a FOV zoom unless an observational feel is intended.","numbers":"","confidence":"medium","evidence":"inferred","falsified_if":"FOV zooms read as equally physical in 3D scenes."},
{"id":"CA-03","category":"camera","rule":"Orbit 15–45° over 2–4s; never more than 90° in under 2s.","numbers":"15–45°, >90°/<2s banned","confidence":"medium","evidence":"inferred","falsified_if":"180° in 1.5s orbits remain spatially readable."},
{"id":"CA-04","category":"camera","rule":"Set browser 3D vertical FOV to 25–40°.","numbers":"25–40°","confidence":"medium","evidence":"inferred","falsified_if":"75° FOV renders rate as equally cinematic."},
{"id":"CA-05","category":"camera","rule":"Make the camera target lead its position via damped follow, so the camera feels operated.","numbers":"0.1–0.2s lag","confidence":"low","evidence":"guess","falsified_if":"Rigid look-at cameras rate as equally handheld or operated."},
{"id":"CA-06","category":"camera","rule":"Bank the camera 0.5–2° into lateral moves.","numbers":"0.5–2°","confidence":"low","evidence":"guess","falsified_if":"Zero-roll lateral moves read as equally physical."},
{"id":"CA-07","category":"camera","rule":"Build handheld from layered noise, not a single sine.","numbers":"0.5–2Hz, 0.2–0.5% W, 0.1–0.3°","confidence":"medium","evidence":"inferred","falsified_if":"Single-sine shake reads as human-operated."},
{"id":"CA-08","category":"camera","rule":"Chain moves by matching velocity, or decelerate below 10% speed before reversing.","numbers":"<10% speed","confidence":"medium","evidence":"inferred","falsified_if":"Full-speed direction reversals read as smooth."},
{"id":"CA-09","category":"camera","rule":"Keep moving text under 10–15% of frame width per second.","numbers":"10–15% W/s","confidence":"low","evidence":"guess","falsified_if":"Text at 40% W/s is read as accurately."},
{"id":"CA-10","category":"camera","rule":"At 24fps with 180° shutter, keep pans slower than one frame width in about 7s to avoid judder.","numbers":"~7s per width","confidence":"low","evidence":"guess","falsified_if":"Faster 24fps pans show no visible judder."},
{"id":"CA-11","category":"camera","rule":"Make rack-focus blur at least 1.5% of frame height on the defocused plane.","numbers":"≥1.5% H, 0.5–1.0s","confidence":"medium","evidence":"guess","falsified_if":"0.5% H defocus redirects the eye equally."},
{"id":"BN-01","category":"banned","rule":"Do not give every element the same ease-in-out at the same duration.","numbers":"","confidence":"high","evidence":"observed","falsified_if":"Uniform-timing pieces rate as equally directed."},
{"id":"BN-02","category":"banned","rule":"Do not scale objects in from zero; start at 0.92–0.96 with translate and opacity.","numbers":"0.92–0.96, 8–24px","confidence":"high","evidence":"observed","falsified_if":"Scale-from-zero rates as equally refined."},
{"id":"BN-03","category":"banned","rule":"Do not use purple-blue-pink diagonal gradient backgrounds.","numbers":"","confidence":"medium","evidence":"inferred","falsified_if":"Viewers do not associate such gradients with generated content."},
{"id":"BN-04","category":"banned","rule":"Do not add floating particles or bokeh dust without a narrative cause.","numbers":"","confidence":"medium","evidence":"inferred","falsified_if":"Filler particles do not divert fixations from the primary."},
{"id":"BN-05","category":"banned","rule":"Do not cross-dissolve or fade through black as a default transition.","numbers":"","confidence":"medium","evidence":"inferred","falsified_if":"Dissolve-joined pieces rate as equally connected."},
{"id":"BN-06","category":"banned","rule":"Do not put an infinite hover-bob on multiple elements.","numbers":"","confidence":"medium","evidence":"inferred","falsified_if":"Multi-element bob does not reduce primary-motion salience."},
{"id":"BN-07","category":"banned","rule":"Do not use a constant-speed turntable orbit as the sole motion of a 3D object.","numbers":"","confidence":"medium","evidence":"inferred","falsified_if":"Turntable shots rate as equally directed as eased orbits."},
{"id":"BN-08","category":"banned","rule":"Do not render fast motion without motion blur.","numbers":"180° shutter","confidence":"high","evidence":"observed","falsified_if":"Unblurred fast motion shows no strobing at 60fps."},
{"id":"BN-09","category":"banned","rule":"Do not stack drop shadow, outline and gradient fill on text.","numbers":"","confidence":"medium","evidence":"inferred","falsified_if":"Stacked-effect text rates as equally legible and premium."},
{"id":"BN-10","category":"banned","rule":"Do not use lens flares as decoration.","numbers":"","confidence":"low","evidence":"guess","falsified_if":"Flares read as contemporary, not dated, to current viewers."},
{"id":"BN-11","category":"banned","rule":"Do not shake the screen on more than the single biggest impact.","numbers":"4–8 frames","confidence":"medium","evidence":"inferred","falsified_if":"Repeated shakes retain impact strength."},
{"id":"BN-12","category":"banned","rule":"Do not use typewriter-with-cursor reveals outside terminal or code contexts.","numbers":"","confidence":"medium","evidence":"inferred","falsified_if":"Typewriter reveals are read faster than mask reveals."},
{"id":"BN-13","category":"banned","rule":"Do not cycle hues or use rainbow animation.","numbers":"","confidence":"medium","evidence":"inferred","falsified_if":"Hue-cycling pieces rate as equally cohesive."},
{"id":"BN-14","category":"banned","rule":"Do not end on the final action; never fade the end card out.","numbers":"hold ≥1.2s","confidence":"high","evidence":"observed","falsified_if":"Abrupt endings score equal message recall."},
{"id":"BN-15","category":"banned","rule":"Do not use sparkle or star glyphs as decoration.","numbers":"","confidence":"low","evidence":"guess","falsified_if":"Viewers do not associate sparkles with synthetic content."},
{"id":"MC-01","category":"mechanism","rule":"Hide whip-pan cuts at peak velocity with blur at least 10% of frame width.","numbers":"7–12f total, blur ≥10% W","confidence":"medium","evidence":"inferred","falsified_if":"The cut frame is visible at normal speed."},
{"id":"MC-02","category":"mechanism","rule":"On a cut during motion, match screen velocity within 30% across the cut.","numbers":"±30%","confidence":"medium","evidence":"guess","falsified_if":"50% velocity mismatches read as continuous."},
{"id":"MC-03","category":"mechanism","rule":"In shared-element transitions, animate the container and counter-scale content; reveal new content after 60%.","numbers":"0.5–0.8s, 60%","confidence":"medium","evidence":"inferred","falsified_if":"Directly scaled content shows no visible stretching."},
{"id":"MC-04","category":"mechanism","rule":"Zoom-through with exponential scale interpolation, not linear.","numbers":"s=s0·(s1/s0)^ease(t)","confidence":"high","evidence":"inferred","falsified_if":"Linear-scale zooms read as constant speed."},
{"id":"MC-05","category":"mechanism","rule":"Preserve volume in squash and stretch.","numbers":"sx=1/sqrt(sy), sy 0.75–0.85 for 2–4f","confidence":"high","evidence":"observed","falsified_if":"Non-volume-preserving squash reads as equally solid."},
{"id":"MC-06","category":"mechanism","rule":"Keep anticipation to 5–10% of travel over 80–150ms.","numbers":"5–10%, 80–150ms","confidence":"medium","evidence":"inferred","falsified_if":"25% anticipation reads as confident, not hesitant."},
{"id":"MC-07","category":"mechanism","rule":"Increase follow-through lag 15–30ms per level of hierarchy.","numbers":"15–30ms/level","confidence":"low","evidence":"guess","falsified_if":"Equal lag across levels reads as more organic."},
{"id":"MC-08","category":"mechanism","rule":"Animate stroke draw-on over arc-length-normalised paths.","numbers":"0.4s per 50% W","confidence":"high","evidence":"inferred","falsified_if":"Parametric-t draw-on shows no speed variation on curves."},
{"id":"MC-09","category":"mechanism","rule":"Use a hard threshold with a thin emissive edge for noise dissolves.","numbers":"edge 0.02–0.05","confidence":"medium","evidence":"inferred","falsified_if":"Soft-threshold dissolves read as distinct from cross-dissolves."},
{"id":"MC-10","category":"mechanism","rule":"Overscan parallax layers by camera travel times speed ratio plus 5%.","numbers":"ratios 0.2/0.5/1.0/1.4","confidence":"high","evidence":"inferred","falsified_if":"Layer edges never appear without overscan."},
{"id":"MC-11","category":"mechanism","rule":"Make every periodic parameter's period divide the loop length exactly.","numbers":"","confidence":"high","evidence":"observed","falsified_if":"Loops with non-dividing periods show no seam."},
{"id":"MC-12","category":"mechanism","rule":"Limit beat flashes to ΔL 0.3 and never more than 3 per second.","numbers":"ΔL≤0.3, ≤3/s","confidence":"high","evidence":"observed","falsified_if":"Faster flashes pass photosensitivity analysis."},
{"id":"MC-13","category":"mechanism","rule":"Run a specular sweep once per piece, matched to the key-light angle.","numbers":"15–25% width, +0.15–0.25 L, 0.5–0.8s","confidence":"low","evidence":"guess","falsified_if":"Repeated sweeps retain their finishing effect."},
{"id":"MC-14","category":"mechanism","rule":"Originate wipes and irises at the previous focal point, and size the final radius to the far corner.","numbers":"","confidence":"medium","evidence":"inferred","falsified_if":"Arbitrary-origin wipes read as equally motivated."},
{"id":"MC-15","category":"mechanism","rule":"Morph shapes by interpolating signed distance fields, not vertices.","numbers":"","confidence":"medium","evidence":"inferred","falsified_if":"Vertex morphs between mismatched topologies show no tangling."},
{"id":"RD-01","category":"render","rule":"Derive all time from frame index divided by fps; never wall clock.","numbers":"t=frame/fps","confidence":"high","evidence":"observed","falsified_if":"Two exports of the same composition differ."},
{"id":"RD-02","category":"render","rule":"Seed all randomness and step physics at a fixed substep.","numbers":"1/240s","confidence":"high","evidence":"observed","falsified_if":"Unseeded renders are identical across runs."},
{"id":"RD-03","category":"render","rule":"Default to a 180° shutter with 8–16 subframes, 32 for whips.","numbers":"180°, 8–16/32","confidence":"high","evidence":"observed","falsified_if":"4 subframes produce no visible stepping in fast moves."},
{"id":"RD-04","category":"render","rule":"Accumulate motion-blur subframes in linear light, centred on the frame time.","numbers":"−0.25..+0.25 frame","confidence":"high","evidence":"inferred","falsified_if":"sRGB accumulation shows no darkened bright edges."},
{"id":"RD-05","category":"render","rule":"Wait for all fonts to load before rendering frame 0.","numbers":"","confidence":"high","evidence":"observed","falsified_if":"No fallback-font frame ever appears without waiting."},
{"id":"RD-06","category":"render","rule":"Tag exports BT.709 with correct range flags; browsers render full range, H.264 delivers limited.","numbers":"16–235 limited","confidence":"high","evidence":"observed","falsified_if":"Untagged exports show identical blacks across players."},
{"id":"RD-07","category":"render","rule":"Deliver H.264 High yuv420p at CRF 16–18 with 1–2s keyframes.","numbers":"1080p60 12–20Mbps","confidence":"medium","evidence":"inferred","falsified_if":"CRF 23 shows no gradient artefacts on dark scenes."},
{"id":"RD-08","category":"render","rule":"Use 10-bit or dither for gradient-heavy pieces.","numbers":"","confidence":"high","evidence":"observed","falsified_if":"8-bit undithered dark gradients show no banding."},
{"id":"RD-09","category":"render","rule":"Avoid saturated strokes thinner than 2px on contrasting hues.","numbers":"<2px","confidence":"medium","evidence":"inferred","falsified_if":"4:2:0 export of a 1px red-on-blue line shows no chroma smear."},
{"id":"RD-10","category":"render","rule":"Master social audio at −14 LUFS integrated with true peak at or below −1 dBTP.","numbers":"−14 LUFS, −1 dBTP","confidence":"high","evidence":"observed","falsified_if":"Platforms do not normalise louder masters."},
{"id":"RD-11","category":"render","rule":"Verify audio sync on the encoded file, accounting for codec priming delay.","numbers":"AAC ~1024 samples","confidence":"medium","evidence":"inferred","falsified_if":"Encoded files never shift sync relative to the timeline."},
{"id":"RD-12","category":"render","rule":"Render at 2× and downscale, or use 4× MSAA; keep lines at least 1.5px at 1080p.","numbers":"2×, ≥1.5px","confidence":"high","evidence":"observed","falsified_if":"1× renders show no edge crawl in motion."},
{"id":"BR-01","category":"brief","rule":"Turn a capability-demo brief into one throughline object transformed across every shot, not a montage.","numbers":"","confidence":"medium","evidence":"inferred","falsified_if":"Effect montages rate as showing more craft than a single throughline."},
{"id":"BR-02","category":"brief","rule":"Choose a tempo that makes runtime a whole number of bars.","numbers":"120BPM: 10s = 5 bars","confidence":"high","evidence":"inferred","falsified_if":"Non-bar-aligned endings feel equally resolved."},
{"id":"BR-03","category":"brief","rule":"Assign each shot one distinct mechanism linked to the next by a shared element or matched velocity.","numbers":"","confidence":"medium","evidence":"inferred","falsified_if":"Unlinked shots read as equally cohesive."},
{"id":"BR-04","category":"brief","rule":"Write success criteria a frame-step review can check: focal count, beat error, hold length, accent area.","numbers":"±1f, ≥1.2s, ≤10%","confidence":"medium","evidence":"inferred","falsified_if":"Pieces passing all criteria still rate as amateur."}
]
```