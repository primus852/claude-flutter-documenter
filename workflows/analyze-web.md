# analyze-web — Sub-workflow

Used by `code-cartographer` agent for web projects.

## Process

1. Run `node ${CLAUDE_PLUGIN_ROOT}/bin/documenter.cjs analyze-web <TARGET_ROOT>` via Bash.
2. The CLI writes `<DOCS_DIR>/analysis/routes.json`.
3. If the CLI is not yet installed (`node_modules` missing), fall back to inline analysis using the patterns in `skills/web-app-analysis/`.
4. Validate that routes.json has at least 1 entry. If zero routes found, ask the user:
   > "I couldn't detect any routes. What framework does this app use? (Next.js / React Router / Vue / Angular / Plain HTML)"
   Then retry with the specific framework's patterns.
