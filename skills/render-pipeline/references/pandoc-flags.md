# Pandoc Flags Reference

## Common base flags

```bash
pandoc input.md \
  --standalone \
  --toc \
  --toc-depth=2 \
  --number-sections \
  --resource-path=. \
  -o output.<ext>
```

- `--standalone` — produces a complete document (not a fragment)
- `--toc` — generate Table of Contents
- `--toc-depth=2` — include H2 headings in TOC
- `--number-sections` — auto-number chapters
- `--resource-path=.` — resolve relative image paths from the manual's directory

## Typst PDF

```bash
pandoc input.md \
  --pdf-engine=typst \
  --template=manual.typ \
  --standalone \
  --toc \
  -o manual.pdf
```

## xelatex + Eisvogel PDF

```bash
pandoc input.md \
  --pdf-engine=xelatex \
  --template=eisvogel \
  --listings \
  -V colorlinks=true \
  -V linkcolor=blue \
  -V urlcolor=blue \
  -V toccolor=black \
  --metadata-file=eisvogel-meta.yaml \
  --standalone \
  --toc \
  -o manual-eisvogel.pdf
```

## LaTeX source

```bash
pandoc input.md \
  --to=latex \
  --pdf-engine=xelatex \
  --template=eisvogel \
  --listings \
  --standalone \
  --toc \
  -o manual.tex
```

## HTML

```bash
pandoc input.md \
  --standalone \
  --toc \
  --self-contained \
  --css=manual.css \
  -o manual.html
```

- `--self-contained` — embed all images as base64 (single-file HTML)

## Image embedding

For Typst and LaTeX, images must be in a path accessible from the working directory.
Run pandoc from `<target>/.documenter/` so that `screenshots/web/login.png` resolves correctly.

## Mermaid SVG in PDF

Pandoc can embed SVG natively for Typst and HTML. For xelatex, convert SVGs to PDF first:
```bash
# Using Inkscape (preferred):
inkscape diagram.svg --export-pdf=diagram.pdf

# Using cairosvg (Python):
cairosvg diagram.svg -o diagram.pdf
```
Then reference the PDF version in the Markdown: `![Flow](diagrams/journey.pdf)`.
