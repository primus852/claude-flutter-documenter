# Typst Template Notes

## Why Typst for the default path

- Single binary, no TeX Live required
- Compiles ~27× faster than xelatex
- Native SVG support (Mermaid diagrams work without conversion)
- Simple template syntax (not LaTeX macros)

## Template location

`${CLAUDE_PLUGIN_ROOT}/templates/manual.typ`

Pass to pandoc: `--template=${CLAUDE_PLUGIN_ROOT}/templates/manual.typ`

## Template variable reference

Pandoc passes these to the Typst template as `#doc.title`, `#doc.author`, etc.:
- `title` — document title
- `subtitle` — subtitle (optional)
- `author` — author name
- `date` — date string
- `lang` — language code (e.g. `en`)
- `toc` — boolean, whether to include TOC
- `number-sections` — boolean

## Key Typst syntax in the template

```typst
#set document(title: [#doc.title], author: doc.author)
#set page(paper: "a4", margin: (top: 2.5cm, bottom: 2.5cm, left: 3cm, right: 2.5cm))
#set text(font: "New Computer Modern", size: 11pt, lang: doc.lang)
#set heading(numbering: "1.1")
```

## SVG images

Typst renders SVG natively:
```typst
#figure(
  image("diagrams/overview.svg", width: 90%),
  caption: [Application navigation overview],
)
```

In Pandoc Markdown: `![caption](diagrams/overview.svg)` renders correctly without conversion.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `error: unknown font family` | Install the font or change `font:` to `"Libertinus Serif"` (bundled with Typst) |
| Image not found | Run pandoc from `<target>/.documenter/` — all paths are relative to cwd |
| Typst not found | `brew install typst` |
