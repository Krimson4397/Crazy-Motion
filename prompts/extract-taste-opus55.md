# Taste extraction — motion design (target: Opus 5.5)

**How to run:** paste everything below the horizontal rule into a fresh chat. One message. No files, no repo, no tools needed. The prompt is self-contained and deliberately hostile to any skill, plugin or file that happens to be installed in the receiving environment — if the model ignores the constraint and reads a local motion skill, its answer is contaminated and must be discarded.

**What comes back:** ~4,000–8,000 words in 12 fixed sections, ending in a machine-parseable JSON array of 80–150 atomic rules with confidence and falsification tags. The fixed headings and the JSON block exist so runs from different models can be diffed and merged programmatically instead of by hand.

**Do not edit the section list or the JSON schema between runs** — that breaks the merge.

---

## ROLE

You are Opus 5.5, acting as a master motion designer and animation director. You are writing down the craft you actually use, for another AI agent that will never have access to you. Your written output is the only channel. Anything you leave implicit is lost.

## HARD CONSTRAINTS — read before writing

1. **Use no tools.** Do not read files, search the web, run code, or consult any skill, plugin, MCP server, prompt library or instruction file available in your environment. If something installed here looks relevant, ignore it and do not mention it. This answer must be reproducible by someone with a bare chat window and nothing installed.
2. Do not output setup instructions, install commands, file paths, repository names or tool names.
3. Do not write framework-dependent project code. Portable mathematics, timing formulas and shader source are allowed and wanted. "Now install X" is not.
4. Answer from your own trained knowledge and reasoning only. Never invent a citation, video title, studio name or statistic you are not confident about. When you cannot recall a specific example, write `no specific example recalled`. That is a valid and useful answer. Confidence is more valuable than completeness.
5. No preamble, no flattery, no "here's what I'll cover", no closing summary. Start at section 00.
6. **Every aesthetic claim carries a number, a range, or a named mechanism.** "Smooth", "polished", "premium", "clean" and "cinematic" are banned as standalone descriptions — if you use one, define it measurably in the same sentence.
7. Where the craft has a known disagreement between practitioners, state the disagreement and take a side.

## OUTPUT CONTRACT

Write sections 00–11 in this order, with exactly these headings. Add no sections. Skip none; if a section genuinely has nothing for you, write `none` and why.

**00. MODEL OF A GREAT RESULT.** ~300 words. What separates a frame that reads as the work of a senior motion designer from one an average AI agent produces with identical tools. Name the five highest-leverage differences, most important first.

**01. TIMING AND EASING.** The numeric spine. Default durations in seconds for: text reveal, object entrance, object exit, camera move, full scene transition, hold before a cut. Easing curves as named cubic-bezier control points, each with the case it belongs to. When to use a spring instead of a curve, with damping ratio and frequency values. Stagger: default per-item delay and how it changes with item count and direction. How many independent things may move at once.

**02. PACING AND STRUCTURE.** Shot-list anatomy for 5s, 10s and 30s pieces. Maximum and target shot length. Behaviour on a beat grid at 100/120/140 BPM: where cuts land, how far off-grid is tolerable. How much of a piece may be still. What has to happen inside the first 1.5 seconds.

**03. COMPOSITION AND HIERARCHY.** Grid and safe areas. Focal points per shot. Permitted empty-frame ratio. Optical centring. Depth cues ranked by strength. Where the eye lands in the first 300ms and the mechanisms that steer it.

**04. COLOR, LIGHT AND TYPE.** Palette construction with numbers: hue count, saturation and lightness ranges, background-to-subject value separation, accent-to-surface ratio. Gradient and glow rules with thresholds. Type: tracking, weight, size hierarchy, and animation units (word / line / character) with the case for each.

**05. CAMERA LANGUAGE.** The move vocabulary — push, pull, orbit, whip, parallax, rack focus, handheld, and any you consider essential that is missing. What each communicates, when it is right, how to chain two moves, how to make browser 3D read as a real camera rather than a viewport, and how much motion the frame tolerates at each speed.

**06. BANNED.** The anti-pattern list: everything that marks motion as AI-made and cheap, most damning first, 25 or more entries. Each gets a one-line reason and the replacement. Be technical and specific, not moral.

**07. MECHANISMS.** 20 or more named, reusable motion and transition mechanisms. For each: name, what it does, when to use it, its failure mode, and the timing or geometry trick that makes it work. A builder will lean on this section hardest.

**08. RENDER AND EXPORT REALITY.** What breaks between a page that looks right live and a file that looks right exported. Motion blur and shutter angle, subframe count and blending, frame stepping, determinism, font loading, timing drift, colour range, codec and bitrate, audio sync, loudness targets. Give numbers.

**09. COMPILING A VAGUE BRIEF.** The procedure that turns a one-line prompt — use `show me how good a motion designer you are` as the input — into a concept, palette, shot list, beat map and success criteria, with no further input from the user. Then execute it once, fully, as a worked example: a 10-second 60fps piece, shot by shot, with timings and the mechanism used in each shot.

**10. SELF-AUDIT AND BLIND SPOTS.** Where your taste most likely comes from. Which of your rules are widely shared professional craft versus your own preference. Which claims you suspect are wrong, dated or culturally local. What you would have to see rendered to check yourself.

**11. RULES AS DATA.** One fenced ```json block. A flat array of atomic rules extracted from sections 00–10.

## SECTION 11 SCHEMA

One object per atomic rule. Each rule under 220 characters. Emit 80–150 rules.

```json
[
  {
    "id": "TM-01",
    "category": "timing|easing|pacing|composition|color|type|camera|banned|mechanism|render|brief",
    "rule": "imperative, self-contained, no back-reference to another rule",
    "numbers": "the exact values, or an empty string",
    "confidence": "high|medium|low",
    "evidence": "observed | inferred | guess",
    "falsified_if": "a concrete thing visible in a rendered video that would prove this rule wrong"
  }
]
```

`confidence` and `evidence` must be honest. `guess` is expected on some rules and is far more useful than false certainty. A rule with no falsification condition should be deleted rather than emitted.

## LENGTH

4,000–8,000 words. Depth on each rule beats coverage of more rules. Do not pad, do not restate a rule in two sections, do not add a closing paragraph.
