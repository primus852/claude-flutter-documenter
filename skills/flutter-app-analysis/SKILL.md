---
name: flutter-app-analysis
description: "Procedural knowledge for analyzing Flutter app codebases to extract user-facing screens, routes, form fields, and navigation. Use this skill when the code-cartographer agent needs guidance on Flutter-specific extraction patterns. Covers MaterialApp routes, GoRouter config, and widget text extraction. Skip for web or backend codebases."
version: 0.1.0
---

This skill carries the extraction patterns for Flutter apps.

## Entry points (check in priority order)

1. `lib/main.dart` — contains `MaterialApp(routes:` or `MaterialApp.router(`
2. `lib/router.dart` or `lib/app_router.dart` — standalone router config
3. `lib/core/router/` — common sub-directory for GoRouter configs
4. Any file with `GoRouter(routes:` — search: `grep -r "GoRouter(" lib/ -l`

@${CLAUDE_PLUGIN_ROOT}/skills/flutter-app-analysis/references/materialapp-routes.md
@${CLAUDE_PLUGIN_ROOT}/skills/flutter-app-analysis/references/gorouter-config.md
@${CLAUDE_PLUGIN_ROOT}/skills/flutter-app-analysis/references/widget-text-extraction.md
