---
name: manual-authoring
description: "Procedural knowledge for writing end-user manuals. Use this skill when writing, editing, or reviewing user-facing documentation chapters, getting-started guides, how-to sections, or troubleshooting entries. Covers tone, voice, chapter structure, audience calibration, and screenshot/diagram integration. Skip when the user wants API reference docs, code comments, or developer-facing documentation."
version: 0.1.0
---

This skill carries the style rules, structural templates, and writing heuristics for producing consistent, high-quality end-user manuals with claude-flutter-documenter.

## When drafting manual content, always:

1. **Load and follow** the references in this skill before writing a single word:
   - `references/tone-and-voice.md` — mandatory voice rules
   - `references/chapter-structure.md` — mandatory section layout
   - `references/audience-types.md` — calibrate reading level and detail

2. **Use the templates** from `${CLAUDE_PLUGIN_ROOT}/templates/`:
   - `manual.md` — top-level document scaffold
   - `chapter.md` — per-feature chapter scaffold

3. **Never invent features** that don't appear in routes.json or journeys.json. If uncertain, omit and add a `<!-- TODO: verify -->` comment.

4. **Prefer screenshots over prose** for navigation steps. Prose fills gaps only.

5. **One action per step** in numbered lists. Never combine two user actions in one step.

6. **Test your own writing**: re-read each paragraph as a first-time user. If a step requires prior knowledge not provided in the manual, add it.

## Reference files

- `references/tone-and-voice.md` — writing style, vocabulary, dos and don'ts
- `references/chapter-structure.md` — required sections per chapter, heading hierarchy
- `references/audience-types.md` — end-user vs admin vs power-user calibration

## Example files

- `examples/sample-chapter.md` — a complete example chapter for reference

@${CLAUDE_PLUGIN_ROOT}/skills/manual-authoring/references/tone-and-voice.md
@${CLAUDE_PLUGIN_ROOT}/skills/manual-authoring/references/chapter-structure.md
@${CLAUDE_PLUGIN_ROOT}/skills/manual-authoring/references/audience-types.md
