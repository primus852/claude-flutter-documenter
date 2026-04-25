# Eisvogel Template Tuning

## Install location

```bash
~/.local/share/pandoc/templates/eisvogel.latex
```

Download: https://github.com/Wandmalfarbe/pandoc-latex-template/releases

## Key metadata variables (set in `eisvogel-meta.yaml`)

```yaml
title: "Project Name — User Manual"
subtitle: "Version 1.0"
author: "Your Organization"
date: "2026-04-25"
lang: en

# Cover page
titlepage: true
titlepage-color: "1F3864"       # dark blue
titlepage-text-color: "FFFFFF"
titlepage-rule-color: "FFFFFF"
titlepage-rule-height: 2

# Typography
mainfont: "TeX Gyre Termes"
monofont: "Source Code Pro"
fontsize: 11pt
linestretch: 1.3

# Code blocks
listings-no-page-break: true
code-block-font-size: \footnotesize

# Margins
geometry: "top=2.5cm,bottom=2.5cm,left=3cm,right=2.5cm"

# Table of contents
toc-own-page: true

# Header/footer
header-right: "\\small \\leftmark"
footer-center: "\\thepage"
```

## Common tuning scenarios

### Wider code blocks
Add to metadata: `code-block-font-size: \scriptsize`

### Disable section numbering
Remove `--number-sections` from pandoc flags.

### Logo on cover page
```yaml
titlepage-background: "assets/cover-background.pdf"
```
Or overlay a logo image in the titlepage area.

### Two-column appendix
Use a `\twocolumn` LaTeX raw block in the Markdown (advanced).

## Troubleshooting

| Error | Fix |
|-------|-----|
| `! LaTeX Error: File 'adjustbox.sty' not found` | `sudo tlmgr install adjustbox` |
| `! LaTeX Error: File 'mdframed.sty' not found` | `sudo tlmgr install mdframed` |
| Image too large for page | Add `{ width=80% }` attribute to image: `![alt](path.png){ width=80% }` |
| SVG not supported | Convert to PDF with Inkscape first |
