# analyze-flutter — Sub-workflow

Used by `code-cartographer` agent for Flutter projects.

## Process

1. Run `node ${CLAUDE_PLUGIN_ROOT}/bin/documenter.cjs analyze-flutter <TARGET_ROOT>` via Bash.
2. The CLI writes `<DOCS_DIR>/analysis/routes.json`.
3. If CLI is not installed, fall back to inline analysis using the patterns in `skills/flutter-app-analysis/`.
4. Validate routes.json. If zero routes, ask:
   > "I couldn't find Flutter routes. Does this app use MaterialApp.routes, GoRouter, or AutoRoute?"
   Then retry with the specific pattern.
