---
name: render-pipeline
description: "Procedural knowledge for rendering Markdown manuals to PDF (Typst, xelatex+eisvogel), LaTeX, and HTML using Pandoc. Use this skill when invoking pandoc-render.cjs, troubleshooting LaTeX compilation errors, tuning eisvogel PDF styling, or adjusting Typst template output. Skip for content-writing or analysis tasks."
version: 0.1.0
---

This skill carries the rendering pipelines and configuration knobs for multi-format output.

## Format decision matrix

| Format | Engine | Quality | Speed | Use when |
|--------|--------|---------|-------|----------|
| `.pdf` (default) | Pandoc + Typst | High | Fast (~2s) | Quick preview, most deliveries |
| `-eisvogel.pdf` | Pandoc + xelatex | Very high | Slow (~30s) | Final polished delivery |
| `.tex` | Pandoc | N/A | Instant | Client has LaTeX workflow |
| `.html` | Pandoc | Good | Instant | Web viewing, internal links |

@${CLAUDE_PLUGIN_ROOT}/skills/render-pipeline/references/pandoc-flags.md
@${CLAUDE_PLUGIN_ROOT}/skills/render-pipeline/references/eisvogel-tuning.md
@${CLAUDE_PLUGIN_ROOT}/skills/render-pipeline/references/typst-template-notes.md
