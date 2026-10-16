# Crazy Motion

Motion design taste, extracted and written down — for AI agents that make
video by writing code, not by driving an engine.

Two halves, one repo:

- **`prompts/`** — the extraction prompt. Points a frontier model at its own
  taste and makes it write that taste down as testable rules.
- **`skills/`** — the agent skill that consumes the result. Build pending.

## Status

| Part | State |
|---|---|
| `prompts/extract-taste-opus55.md` | Ready to run |
| `prompts/runs/opus55.md` | First run landed — 12 sections, 8,500 words, 115 schema-valid rules |
| `skills/cinematic-motion-design/` | Not written yet |

The skill is deliberately not written yet. It gets written from the extracted
rules, not from opinion, so the extraction has to land first.

## The extraction prompt

`prompts/extract-taste-opus55.md` targets Opus 5.5 and is self-contained:
paste it into one fresh chat, no files or tools needed.

Two design decisions worth knowing about:

**It is hostile to the receiving environment.** The first constraint forbids
tools, files, web access, and *any skill, plugin or MCP server installed
there* — and says why. Without that clause, a recipient who happens to have a
motion skill installed will read it and hand back a copy of the ecosystem
instead of the model's own taste. That output is contaminated and should be
discarded.

**It ends in data, not prose.** Sections 00–11 are prose, but section 11 is a
fenced JSON array of 80–150 atomic rules, each tagged with `confidence`,
`evidence` (observed / inferred / guess) and a `falsified_if` condition — a
concrete thing visible in a rendered video that would prove the rule wrong.
A rule with no falsification condition is deleted rather than emitted.

That schema is the point. Runs from different models land in the same shape,
so they can be diffed and merged in code instead of read by hand, and every
rule arrives with a way to test it.

### What comes back

One chat reply, roughly 4,000–8,000 words of markdown: twelve sections under
the headings `## 00` through `## 11`, prose throughout, one fenced JSON block
at the end.

Save it raw to `prompts/runs/<model>.md`. The fences matter — the extractor
reads them.

```bash
# Claude Code or any CLI agent
claude -p "$(cat prompts/extract-taste-opus55.md)" > prompts/runs/opus55.md

# App or web chat: copy the whole reply into
# prompts/runs/opus55.md by hand
```

## The skill

`skills/cinematic-motion-design/` will be a portable agent skill — Claude
Code, Codex, Cursor, Hermes, anything that reads `SKILL.md`. The agent writes
motion design as code (Canvas, SVG, Three.js, GLSL, Web Audio), renders it
deterministically, looks at its own frames, and revises.

Planned shape, following the architecture of the strongest existing skill in
this space (thin `SKILL.md`, detail in `references/`):

```
skills/cinematic-motion-design/
  SKILL.md              workflow, non-negotiables, when to use
  references/           timing, composition, camera, mechanisms,
                        anti-patterns, render-and-export, brief compiler
  scripts/              deterministic capture, ffmpeg encode, contact sheet
  templates/            scene skeleton with a pure render(t)
```

### What is actually new here

Four or five public skills already cover the *pipeline*: a deterministic
HTML engine, Playwright capture, ffmpeg encode, beat grids, contact sheets.
Re-implementing that would be wasted work.

Two things are not covered by any of them:

1. **Rules derived from a corpus, not from opinion.** 703 published prompts
   from real viral videos, each tagged with the technique it uses. Rules that
   survive statistical extraction across that corpus are worth more than
   rules a model asserts confidently.
2. **A blind benchmark.** A fixed set of briefs rendered with and without the
   skill, scored by a critic that does not know which is which. Without it,
   "we encoded taste" is unfalsifiable — which is the failure mode of every
   motion skill published so far.

If neither of those lands, this repo is just a fifth copy of the same ideas.

## Credits

Built on the work of others, all MIT. See `CREDITS.md` for the notices and
`scripts/fetch-references.sh` to clone the reference material locally.

## Licence

MIT — see `LICENSE`.
