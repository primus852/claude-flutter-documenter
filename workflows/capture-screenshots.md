# capture-screenshots — Sub-workflow

Used by `screenshot-orchestrator` agent.

## Flutter path

1. Read `DOCS_DIR/analysis/routes.json`.
2. Check `flutter devices`.
3. If connected: launch app and navigate per route using deep links or ADB. Save each screenshot to `DOCS_DIR/screenshots/<route-id>.png` (flat layout — no subfolder).
4. If no device: show fallback instructions; read manual folder at `DOCS_DIR/screenshots/`.
5. Write `manifest.yaml`.

## Manifest update

Always merge with existing `manifest.yaml` rather than overwriting — preserve manually added entries.
