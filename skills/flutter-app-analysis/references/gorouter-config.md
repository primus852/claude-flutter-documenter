# GoRouter — Extraction Patterns

## Basic GoRouter config

```dart
final router = GoRouter(
  routes: [
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/dashboard',
      builder: (context, state) => const DashboardScreen(),
      routes: [
        GoRoute(
          path: 'settings',  // resolved as /dashboard/settings
          builder: (context, state) => const SettingsScreen(),
        ),
      ],
    ),
  ],
);
```

## Extraction approach

1. Find all `GoRoute(` declarations in the file.
2. For each, extract:
   - `path:` value (string literal)
   - `builder:` or `pageBuilder:` — find the widget class name after `=>`
   - `name:` if present (preferred display name)
   - `routes:` for nested routes (recurse, prepend parent path)

## Regex for GoRoute path + builder

```
GoRoute\(\s*(?:name:\s*'[^']*',\s*)?path:\s*'([^']+)',\s*(?:name:[^,]+,\s*)?(?:builder|pageBuilder):[^=>]+?=>\s*(?:const\s+)?(\w+)\(
```

## Shell routes and navigation shells

`ShellRoute` wraps routes in a shared scaffold (e.g. bottom nav bar). Treat its children as top-level routes with the shared nav context noted.

## Redirect guards

`redirect:` callbacks encode auth guards. Note which routes have redirects — these are protected screens (mark `"requiresAuth": true` in routes.json).
