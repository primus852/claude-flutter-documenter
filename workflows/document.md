# /document — Main Workflow

This is the 6-step orchestration workflow executed by `commands/document.md`.

---

## Step 0 — Update check

Run silently in the background before anything else:

```bash
PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT}" "${CLAUDE_PLUGIN_ROOT}/scripts/check-update.sh"
```

If it prints output, show it as a one-line notice at the top of the response, e.g.:
> `💡 flutter-doc v0.3.0 available → /plugin update flutter-doc`

Never block or fail if the script errors — proceed regardless.

---

## Step 1 — Parse arguments

Extract from `$ARGUMENTS`:
- `AUDIENCE` — `end-user` (default) | `admin` | `power-user`
- `SOURCE_DIR` — value of `--src <path>` flag (optional). A path relative to `TARGET_ROOT` that pins exactly which subfolder to analyze (e.g. `lib`). When omitted, auto-detection picks the source root.

---

## Step 1 — Detect target project

Read the current working directory (the project the user has open in Claude Code).

1. Check for `pubspec.yaml` → Flutter project. Note the `name` field as `PROJECT_NAME` and `description` as `PROJECT_DESCRIPTION`.
2. If `pubspec.yaml` is absent, abort:
   > "No pubspec.yaml found. claude-flutter-documenter only supports Flutter projects. Please run this command from the root of a Flutter project."

Set `TARGET_ROOT` = current working directory.
Set `DOCS_DIR` = `TARGET_ROOT/.documenter/`.
Set `SOURCE_DIR` = `TARGET_ROOT/<--src value>` if provided, else `TARGET_ROOT`.

---

## Step 2 — Bootstrap

1. Create `.documenter/` directory structure if not present:
   ```
   .documenter/analysis/
   .documenter/screenshots/
   .documenter/diagrams/
   .documenter/manual/chapters/
   .documenter/manual/journeys/
   ```

2. Load or create `.documenter/config.json`:
   ```json
   {
     "projectName": "<PROJECT_NAME>",
     "sourceDir": "<SOURCE_DIR relative to TARGET_ROOT, or empty string>",
     "audience": "<AUDIENCE>",
     "version": "1.0",
     "contactEmail": "support@example.com",
     "contactUrl": "https://help.example.com",
     "locale": "en",
     "createdAt": "<ISO date>",
     "updatedAt": "<ISO date>"
   }
   ```
   If file already exists, merge with any flags from `$ARGUMENTS` (flags win). Once `sourceDir` is saved, it becomes the default for all future runs on this project — no need to pass `--src` again.

3. Print: "▶ Documenting **<PROJECT_NAME>** for audience: **<AUDIENCE>**"

---

## Step 3 — Analyze codebase

Spawn `code-cartographer` agent with:
- `TARGET_ROOT`
- `SOURCE_DIR` — the pinned subfolder to analyze (pass `""` if not set)
- `OUTPUT_DIR` = `DOCS_DIR/analysis/`

Wait for completion. On failure, abort and print the error — analysis is a hard dependency.

Confirm: "✓ Analysis complete — N routes, M journeys found."

---

## Step 4 — Capture screenshots

Spawn `screenshot-orchestrator` agent with:
- `TARGET_ROOT`
- `DOCS_DIR`
- `PLUGIN_ROOT` = `${CLAUDE_PLUGIN_ROOT}`

This step is optional — if the user declines or no device is available, continue with a warning.

Confirm: "✓ Screenshots: N captured, M skipped."

---

## Step 5 — Generate diagrams

Spawn `diagram-designer` agent with:
- `DOCS_DIR`
- `PLUGIN_ROOT` = `${CLAUDE_PLUGIN_ROOT}`

This step is optional — if `mmdc` is not installed, `.mmd` source files are still written and will render as fenced mermaid blocks in the manual.

Confirm: "✓ Diagrams: N generated."

---

## Step 6 — Draft manual

Spawn `manual-drafter` agent with:
- `TARGET_ROOT`
- `DOCS_DIR`
- `AUDIENCE`
- `PROJECT_NAME`
- `PLUGIN_ROOT` = `${CLAUDE_PLUGIN_ROOT}`

Wait for completion. This produces the `DOCS_DIR/manual/` folder.

Print the final summary:
```
✓ Done! Your manual is ready at .documenter/manual/:

  📘  index.md                 — start here
  📂  chapters/                — N feature chapters
  📂  journeys/                — M how-to walkthroughs
  🛠   troubleshooting.md
  📞  getting-help.md

Open .documenter/manual/index.md in any Markdown viewer
(GitHub, VS Code, Obsidian) and click through the links.

▶ Next: review for accuracy, then run
  /documenter-do "update the <chapter> chapter" to refine any section.
```
