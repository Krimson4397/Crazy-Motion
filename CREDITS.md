# Vendored upstream reference repos

These are **not** part of this repository. They are cloned locally by
`scripts/fetch-references.sh` into `references/` (gitignored) as study material
for building the skill.

Nothing has been copied into this repository from them yet. When craft,
scripts or references are extracted from any of them, the extracted file
carries a line naming its origin, and this file is updated to describe
exactly what was taken.

All five are MIT licensed. The notices below are reproduced as required by
the MIT terms. Verified against the `LICENSE` file in each repo's default
branch root.

---

## howseen-ai/claude-motion-design

```
MIT License
Copyright (c) 2026 Howseen AI (Raphaël Aubry)
```

<https://github.com/howseen-ai/claude-motion-design>

Relevance: a complete code-only pipeline — a `seek(t)` HTML engine, a
Playwright render script with probe/beats/draft/full/pops/loop modes,
subframe motion blur via ffmpeg `tmix`, headless WebGL flags, synthesised
audio, and a frame-locked remake mode.

## echris6/motion-video-kit

```
MIT License
Copyright (c) 2026 echris6
```

<https://github.com/echris6/motion-video-kit>

Relevance: the best knowledge architecture of the set — a thin `SKILL.md`
plus dated `references/`. Its `motion-grammar.md` distils six rules from
28 professional launch films (81,647 frames numerically analysed), and
`gauntlet.md` defines a builder-is-not-judge critic loop.

## iart-ai/motion-design-skills

```
MIT License
Copyright (c) 2026 iart.ai
```

<https://github.com/iart-ai/motion-design-skills>

Relevance: beat-synced editing, shot composition, colour motion, and an
easing graph reference.

## iart-ai/webgl-animation-skills

```
MIT License
Copyright (c) 2026 iart.ai
```

<https://github.com/iart-ai/webgl-animation-skills>

Relevance: Three.js animation, GLSL shaders and particle systems, each as
its own skill with references. The WebGL resource-disposal reference is the
expensive part to rediscover.

## iart-ai/javascript-animation-skills

```
MIT License
Copyright (c) 2026 iart.ai
```

<https://github.com/iart-ai/javascript-animation-skills>

Relevance: zero-asset canvas animation drawn frame by frame, a render
script, a starter template, and a code-made soundtrack.

---

## Reference corpus (not a repo)

<https://github.com/yihui-dev/awesome-opus5-5-videos>

A curated collection of viral videos made by asking Opus 5.5 to write the
animation as code, with the prompt for each. Used here as a **labelled
corpus**: 703 prompts, each tagged with the technique it uses (Canvas, SVG,
GSAP, Three.js, GLSL, Web Audio). The prompts remain the property of their
individual creators and are not redistributed in this repository — only
rules statistically derived across the corpus are used.
