# capture-screenshots — Sub-workflow

Used by `screenshot-orchestrator` agent.

## Web path

1. Read `DOCS_DIR/analysis/routes.json`.
2. Filter dynamic routes (path contains `:` or `[`).
3. Generate `DOCS_DIR/screenshots/playwright.spec.ts` from template.
4. Confirm dev URL with user.
5. Run Playwright. Catch and log failures per route.
6. Write `manifest.yaml`.

## Flutter path

1. Read `DOCS_DIR/analysis/routes.json` filtering `"type": "flutter"`.
2. Check `flutter devices`.
3. If connected: launch app and navigate per route using deep links or ADB.
4. If no device: show fallback instructions; read manual folder.
5. Write `manifest.yaml`.

## Manifest update

Always merge with existing `manifest.yaml` rather than overwriting — preserve manually added entries.
