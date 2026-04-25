# claude-documenter

A Claude Code plugin that reads your codebase and produces a polished end-user manual in Markdown, PDF, and LaTeX — complete with screenshots, flowcharts, and customizable styling.

Supports **web apps** (Next.js, React Router, plain HTML) and **Flutter apps**.

---

## What it does

1. **Analyzes** your codebase: discovers routes, screens, forms, and buttons.
2. **Captures screenshots**: Playwright for web, `flutter screenshot` for Flutter (with fallback to a manual folder).
3. **Draws flowcharts**: Mermaid diagrams for multi-step user journeys.
4. **Writes the manual**: LLM-drafted, consistent voice, one chapter per feature group.
5. **Renders to all formats**:
   - `manual.md` — canonical Markdown source
   - `manual.pdf` — fast render via Pandoc + Typst
   - `manual-eisvogel.pdf` — polished render via Pandoc + xelatex + Eisvogel template
   - `manual.tex` — raw LaTeX deliverable
   - `manual.html` — standalone HTML

All artifacts land in `<your-project>/.documenter/`.

---

## Install

### 1. System dependencies

```bash
cd ~/path/to/claude-documenter
./scripts/install-deps.sh          # installs pandoc, typst, mermaid-cli, basictex via brew
./scripts/postinstall-eisvogel.sh  # downloads eisvogel.latex template
npm install                        # installs Playwright + JS analysis deps
```

### 2. Install the plugin in Claude Code

```bash
# From a local checkout:
/plugin marketplace add ~/IdeaProjects/claude-documenter
/plugin install claude-documenter

# Or from GitHub (once published):
/plugin marketplace add https://github.com/torstenwolter/claude-documenter
/plugin install claude-documenter
```

---

## Usage

Open any web or Flutter project in Claude Code, then:

```
/document                         # guided wizard, auto-detects project type
/document --format pdf            # output PDF only
/document --format all --style eisvogel
/documenter-help                  # full reference
/documenter-do "add a chapter for the settings screen"  # freeform router
```

### Audience options
Pass an audience flag to tailor the prose style:
- `end-user` (default) — step-by-step, plain language
- `admin` — technical detail, assumes familiarity
- `power-user` — keyboard shortcuts, advanced flows

---

## Output

```
.documenter/
├── analysis/
│   ├── routes.json        # discovered routes/screens
│   ├── journeys.json      # multi-step user flows
│   └── manifest.yaml      # screenshot inventory
├── screenshots/
│   ├── web/<route>.png
│   └── flutter/<screen>.png
├── diagrams/
│   └── *.svg
├── manual.md
└── dist/
    ├── manual.pdf
    ├── manual-eisvogel.pdf
    ├── manual.tex
    └── manual.html
```

---

## Commands

| Command | Description |
|---------|-------------|
| `/document [opts]` | Main entrypoint. Runs the full pipeline. |
| `/documenter-help` | Prints all commands, options, and output format reference. |
| `/documenter-do "<text>"` | Routes a freeform request to the right sub-workflow. |

---

## Stack

| Concern | Tool |
|---------|------|
| MD → PDF (fast) | Pandoc + Typst |
| MD → PDF (polished) | Pandoc + xelatex + Eisvogel |
| MD → LaTeX | Pandoc |
| Flowcharts | Mermaid CLI (`mmdc`) |
| Web screenshots | Playwright |
| Flutter screenshots | `flutter screenshot` + manifest YAML |
| JS/TS route extraction | Babel parser |
| Dart route extraction | Regex / AST-grep |

---

## Development

```bash
# Test a sub-command directly:
node bin/documenter.cjs analyze-web ~/IdeaProjects/hvz-revamped/frontend
node bin/documenter.cjs render ~/IdeaProjects/hvz-revamped/.documenter/manual.md all
```

---

## Roadmap

- v0.2: Localization (locale flag in config)
- v0.2: More web frameworks (Nuxt, SvelteKit, Angular)
- v0.3: Flutter integration_test golden screenshots
- v0.3: GitHub Action for auto-generated docs on PR merge
- v1.0: WYSIWYG review mode inside Claude Code
