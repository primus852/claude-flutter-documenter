---
name: web-app-analysis
description: "Procedural knowledge for statically analyzing web application codebases (Next.js, React Router, plain HTML) to extract user-facing routes, forms, buttons, and navigation links. Use this skill when the code-cartographer agent needs guidance on web-specific extraction patterns. Skip for Flutter or backend-only codebases."
version: 0.1.0
---

This skill carries the extraction patterns and heuristics for understanding the user-facing surface of web applications.

## Priority order for framework detection

1. **Next.js App Router** — look for `app/` directory + `next.config.*`
2. **Next.js Pages Router** — look for `pages/` directory + `next.config.*`
3. **React Router** — look for `createBrowserRouter`, `createHashRouter`, `<BrowserRouter>`, `<Routes>` in source
4. **Vue Router** — `router/index.*` with `createRouter`
5. **Angular** — `app-routing.module.ts` or `app.routes.ts`
6. **Plain HTML** — index.html + `<a href>` patterns

## Key extraction targets

@${CLAUDE_PLUGIN_ROOT}/skills/web-app-analysis/references/nextjs-app-router.md
@${CLAUDE_PLUGIN_ROOT}/skills/web-app-analysis/references/react-router.md
@${CLAUDE_PLUGIN_ROOT}/skills/web-app-analysis/references/form-and-button-extraction.md
