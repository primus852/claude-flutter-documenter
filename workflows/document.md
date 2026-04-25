# /document — Main Workflow

This is the 7-step orchestration workflow executed by `commands/document.md`.

---

## Step 0 — Parse arguments

Extract from `$ARGUMENTS`:
- `AUDIENCE` — `end-user` (default) | `admin` | `power-user`
- `FORMAT` — `md` | `pdf` | `latex` | `html` | `all` (default: `all`)
- `STYLE` — `typst` (default) | `eisvogel`

---

## Step 1 — Detect target project

Read the current working directory (the project the user has open in Claude Code).

1. Check for `package.json` → web project (note `name` field as PROJECT_NAME).
2. Check for `pubspec.yaml` → Flutter project (note `name` field as PROJECT_NAME).
3. Check for both → mixed project (rare; treat as `both`).
4. If neither exists, ask:
   > "I can't automatically detect the project type. Is this a web app or Flutter app?"
   
   Use `AskUserQuestion`.

Set `PROJECT_TYPE` = `web` | `flutter` | `both`.
Set `TARGET_ROOT` = current working directory.
Set `DOCS_DIR` = `TARGET_ROOT/.documenter/`.

---

## Step 2 — Bootstrap

1. Create `.documenter/` directory structure if not present:
   ```
   .documenter/analysis/
   .documenter/screenshots/web/
   .documenter/screenshots/flutter/
   .documenter/diagrams/
   .documenter/dist/
   ```

2. Load or create `.documenter/config.json`:
   ```json
   {
     "projectName": "<PROJECT_NAME>",
     "projectType": "<PROJECT_TYPE>",
     "audience": "<AUDIENCE>",
     "formats": ["md", "pdf", "latex", "html"],
     "style": "typst",
     "version": "1.0",
     "createdAt": "<ISO date>",
     "updatedAt": "<ISO date>"
   }
   ```
   If file already exists, merge with any flags from `$ARGUMENTS` (flags win).

3. Print: "▶ Documenting **<PROJECT_NAME>** (<PROJECT_TYPE>) for audience: **<AUDIENCE>**"

---

## Step 3 — Analyze codebase

Spawn `code-cartographer` agent with:
- `TARGET_ROOT`
- `PROJECT_TYPE`
- `OUTPUT_DIR` = `DOCS_DIR/analysis/`

Wait for completion. On failure, abort and print the error — analysis is a hard dependency.

Confirm: "✓ Analysis complete — N routes, M journeys found."

---

## Step 4 — Capture screenshots

Spawn `screenshot-orchestrator` agent with:
- `TARGET_ROOT`
- `DOCS_DIR`
- `PROJECT_TYPE`

This step is optional — if the user declines or no device is available, continue with a warning.

Confirm: "✓ Screenshots: N captured, M skipped."

---

## Step 5 — Generate diagrams

Spawn `diagram-designer` agent with:
- `DOCS_DIR`
- `PLUGIN_ROOT` = `${CLAUDE_PLUGIN_ROOT}`

This step is optional — if `mmdc` is not installed, continue without diagrams.

Confirm: "✓ Diagrams: N generated."

---

## Step 6 — Draft manual

Spawn `manual-drafter` agent with:
- `TARGET_ROOT`
- `DOCS_DIR`
- `AUDIENCE`
- `PROJECT_NAME`
- `PLUGIN_ROOT` = `${CLAUDE_PLUGIN_ROOT}`

Wait for completion. This produces `DOCS_DIR/manual.md`.

Confirm: "✓ Manual drafted — N chapters."

---

## Step 7 — Render to formats

Run via Bash using `bin/documenter.cjs render`:

```bash
cd TARGET_ROOT/.documenter && \
  node ${CLAUDE_PLUGIN_ROOT}/bin/documenter.cjs render manual.md <FORMAT> <STYLE>
```

This produces one or more files in `DOCS_DIR/dist/`.

Print the final summary:
```
✓ Done! Your manual is ready:

  📄  .documenter/manual.md
  📕  .documenter/dist/manual.pdf
  📗  .documenter/dist/manual-eisvogel.pdf   (if eisvogel style)
  📝  .documenter/dist/manual.tex
  🌐  .documenter/dist/manual.html

▶ Next: Open manual.pdf, review for accuracy, then run
  /documenter-do "update the <chapter> chapter" to refine any section.
```
