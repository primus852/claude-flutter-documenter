# React Router — Extraction Patterns

## Route config discovery

### v6 — `createBrowserRouter` / `createHashRouter`
Search for files containing `createBrowserRouter` or `createHashRouter`:
```bash
grep -r "createBrowserRouter\|createHashRouter" src/ --include="*.{ts,tsx,js,jsx}" -l
```
Parse the routes array: `{ path: "...", element: <Component />, children: [...] }`.

### v6 — JSX `<Routes>` and `<Route>`
Search for `<Routes>` in source:
```bash
grep -r "<Routes" src/ --include="*.{tsx,jsx}" -l
```
Extract `<Route path="..." element={<Component />} />` pairs.

### v5 — `<Switch>` and `<Route>`
```bash
grep -r "<Switch" src/ --include="*.{tsx,jsx}" -l
```
Extract `<Route path="..." component={Component} />` pairs.

## Component resolution

For each route, resolve the component name to a file:
- Same-file import: check imports at the top of the router config file.
- Barrel import (`index.ts`): follow the export chain.
- Once found, extract title/forms/buttons using the same JSX extraction rules as Next.js.

## Nested routes

Flatten the tree for route discovery. For child routes, concatenate parent + child paths:
```
{ path: "/dashboard", children: [{ path: "settings" }] }
→ /dashboard/settings
```

## Layout routes (v6 `Outlet`)

Routes with no `path` that render `<Outlet />` are layout wrappers — extract their nav links but don't treat them as standalone routes.
