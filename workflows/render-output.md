# render-output — Sub-workflow

Used by Step 7 of `document.md` and by `/documenter-do` for re-render requests.

## Process

1. Confirm `DOCS_DIR/manual.md` exists. Abort with clear error if not.
2. Run from `DOCS_DIR`:
   ```bash
   node ${CLAUDE_PLUGIN_ROOT}/bin/documenter.cjs render manual.md <FORMAT> <STYLE>
   ```
3. For xelatex/eisvogel path: pre-convert any SVG diagrams to PDF using available tool (Inkscape or cairosvg).
4. Move all rendered files to `DOCS_DIR/dist/`.
5. Print rendered file list and sizes.

## Format-specific checks

- **Typst PDF**: verify `typst` is on PATH. If not: `brew install typst`.
- **Eisvogel PDF**: verify `xelatex` is on PATH AND `eisvogel.latex` template exists in `~/.local/share/pandoc/templates/`. If not: run `scripts/postinstall-eisvogel.sh`.
- **HTML**: requires only `pandoc`. Should always succeed.
