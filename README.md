# claude-flutter-documenter

> A Claude Code plugin that reads your Flutter codebase and produces a cross-linked end-user manual as a folder of Markdown files — complete with screenshots and Mermaid flowcharts.

---

## Purpose

Writing user documentation for a Flutter app is tedious: screens multiply, flows change, and prose goes stale. `claude-flutter-documenter` automates the first draft by letting an LLM do what it's good at — reading code, drafting prose, and keeping structure consistent — while you stay in charge of accuracy.

One command turns a Flutter project into a ready-to-review manual:

- **Routes and screens** discovered via `MaterialApp` / `GoRouter` analysis
- **Screenshots** captured with `flutter screenshot` on a connected device or emulator
- **Mermaid flowcharts** for multi-step user journeys, rendered to SVG if `mmdc` is installed
- **Prose** in a consistent voice, tailored to your chosen audience (end-user, admin, power-user)

All output lands in `.documenter/` inside your project and opens without any build step in VS Code, GitHub, or Obsidian.

---

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| [Claude Code](https://claude.ai/code) | Latest | Plugin host |
| [Node.js](https://nodejs.org) | ≥ 18 | Runs the analysis CLI |
| [Flutter SDK](https://docs.flutter.dev/get-started/install) | Any stable | Must be in `PATH` |
| [Mermaid CLI](https://github.com/mermaid-js/mermaid-cli) (`mmdc`) | Any | Optional — enables SVG diagram export |

---

## Installation

### 1. Clone the plugin

```bash
git clone https://github.com/primus852/claude-flutter-documenter ~/claude-flutter-documenter
cd ~/claude-flutter-documenter
```

### 2. Install dependencies

```bash
npm install                  # JS analysis CLI deps
./scripts/install-deps.sh   # optional: installs mmdc via Homebrew
```

### 3. Register with Claude Code

```bash
# From a local checkout:
/plugin marketplace add ~/claude-flutter-documenter
/plugin install claude-flutter-documenter
```

Once published to the Claude Code marketplace you will be able to install directly:

```bash
/plugin install claude-flutter-documenter
```

---

## Quick Start

Open a Flutter project in Claude Code (the working directory must contain `pubspec.yaml`), then run:

```
/document
```

The plugin walks through six steps automatically:

1. Detects your Flutter project (`pubspec.yaml`)
2. Creates the `.documenter/` output structure
3. Analyzes routes, screens, and user journeys
4. Captures screenshots (skippable if no device is connected)
5. Generates Mermaid diagrams
6. Drafts the manual chapters and index

---

## Usage

```
/document                           # guided run, auto-detects Flutter project
/document end-user                  # audience = end-user (default)
/document admin                     # audience = admin
/document power-user                # audience = power-user
/document --src lib/features/auth   # scope analysis to a subfolder
/documenter-help                    # full command reference
/documenter-do "update the settings chapter"   # freeform refinement
```

### Audience modes

| Audience | Description |
|----------|-------------|
| `end-user` (default) | Step-by-step, plain language, screenshot on every screen |
| `admin` | Technical detail, assumes familiarity with the system |
| `power-user` | Keyboard shortcuts and advanced flows |

### `--src` flag

Scope analysis to a specific subfolder when your app is large or monorepo-structured:

```
/document --src lib/features/onboarding
```

The path is saved in `.documenter/config.json` and becomes the default for all future runs on that project.

---

## Output

```
.documenter/
├── config.json              ← project settings (audience, locale, …)
├── analysis/
│   ├── routes.json          ← discovered routes / screens
│   ├── journeys.json        ← multi-step user flows
│   └── manifest.yaml        ← screenshot inventory
├── screenshots/
│   └── <route-id>.png
├── diagrams/
│   ├── <journey-id>.mmd     ← Mermaid source (always written)
│   └── <journey-id>.svg     ← only if mmdc is installed
└── manual/
    ├── index.md             ← start here
    ├── chapters/
    │   └── <chapter-id>.md
    ├── journeys/
    │   └── <journey-id>.md
    ├── troubleshooting.md
    └── getting-help.md
```

Open `.documenter/manual/index.md` in any Markdown viewer — all internal links resolve without a build step.

---

## Commands

| Command | Description |
|---------|-------------|
| `/document [audience] [--src path]` | Full pipeline: analyze → screenshot → diagram → draft |
| `/documenter-help` | Prints all commands, options, and output structure |
| `/documenter-do "<text>"` | Routes a freeform request to the right sub-workflow |

---

## Configuration

`.documenter/config.json` is created on first run and persists your preferences:

```json
{
  "projectName": "my_app",
  "sourceDir": "lib",
  "audience": "end-user",
  "version": "1.0",
  "contactEmail": "support@example.com",
  "contactUrl": "https://help.example.com",
  "locale": "en",
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-01-01T00:00:00Z"
}
```

Flags passed to `/document` always override saved values.

---

## Stack

| Concern | Tool |
|---------|------|
| Route / screen extraction | Regex + GoRouter config parsing (Node.js CLI) |
| Screenshots | `flutter screenshot` + manifest YAML |
| Flowcharts | Mermaid CLI (`mmdc`) — optional |
| Manual prose | Claude (via Claude Code agent workflow) |

---

## Development

```bash
# Run the analysis CLI directly against a Flutter project:
node bin/documenter.cjs analyze-flutter ~/path/to/my-flutter-app

# Generate diagrams from an existing journeys file:
node bin/documenter.cjs diagrams ~/path/to/my-flutter-app/.documenter/analysis/journeys.json
```

Agent workflows live in `workflows/`, agent definitions in `agents/`, and Markdown chapter templates in `templates/`.

---

## Roadmap

- **v0.2** — Localization (`locale` flag in config)
- **v0.2** — Flutter `integration_test` golden screenshots
- **v0.3** — GitHub Action for auto-generated docs on PR merge
- **v1.0** — WYSIWYG review mode inside Claude Code

---

## License

MIT © [Torsten Wolter](mailto:findnibbler@gmail.com)
