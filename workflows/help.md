# /documenter-help — Reference

Print this reference verbatim.

---

## claude-documenter — Command Reference

### Commands

| Command | Description |
|---------|-------------|
| `/document` | Full pipeline: analyze → screenshots → diagrams → draft → render |
| `/document end-user` | Full pipeline, audience = end-user (default) |
| `/document admin` | Full pipeline, audience = admin |
| `/document power-user` | Full pipeline, audience = power-user |
| `/document --format pdf` | Render PDF only (skip other formats) |
| `/document --format all --style eisvogel` | All formats with Eisvogel PDF styling |
| `/documenter-do "<text>"` | Route a freeform request to the right sub-workflow |
| `/documenter-help` | Show this reference |

### Format options

| Flag | Output |
|------|--------|
| `--format md` | `manual.md` only |
| `--format pdf` | `dist/manual.pdf` (Typst, default) |
| `--format latex` | `dist/manual.tex` + `dist/manual-eisvogel.pdf` |
| `--format html` | `dist/manual.html` |
| `--format all` | All of the above (default) |

### Style options

| Flag | Description |
|------|-------------|
| `--style typst` | Fast PDF via Pandoc + Typst (~2s) — default |
| `--style eisvogel` | Polished PDF via Pandoc + xelatex + Eisvogel template (~30s) |

### Audience options

| Audience | Reading level |
|----------|--------------|
| `end-user` | Plain language, step-by-step, screenshot every screen |
| `admin` | Technical, includes config and permissions |
| `power-user` | Expert, leads with shortcuts and advanced features |

### Output location

All artifacts land in `<your-project>/.documenter/`:
```
.documenter/
├── analysis/routes.json
├── analysis/journeys.json
├── analysis/manifest.yaml
├── screenshots/{web,flutter}/
├── diagrams/*.svg
├── manual.md
└── dist/{manual.pdf, manual-eisvogel.pdf, manual.tex, manual.html}
```

### Config file

`.documenter/config.json` is created on first run and can be edited:
```json
{
  "projectName": "My App",
  "projectType": "web",
  "audience": "end-user",
  "formats": ["md", "pdf", "latex", "html"],
  "style": "typst",
  "version": "1.0"
}
```

### System dependencies

```bash
brew install pandoc typst mermaid-cli
brew install --cask basictex   # for eisvogel/xelatex
npm install                    # in claude-documenter repo
```

Run `${CLAUDE_PLUGIN_ROOT}/scripts/install-deps.sh` to install everything automatically.

### Support

File issues: https://github.com/torstenwolter/claude-documenter/issues
