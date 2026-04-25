# MaterialApp Routes — Extraction Patterns

## Route map declaration

```dart
MaterialApp(
  routes: {
    '/': (context) => const HomeScreen(),
    '/login': (context) => const LoginScreen(),
    '/profile': (context) => ProfileScreen(),
  },
  initialRoute: '/',
)
```

Regex to extract all entries:
```
'(/[^']*)':\s*\(context\)\s*=>\s*(?:const\s+)?(\w+)\(
```

Groups: `(1)` = path, `(2)` = widget class name.

## Named route constants

Some apps declare route names as constants:
```dart
class AppRoutes {
  static const String login = '/login';
  static const String home = '/';
}
```

Search for `static const String` in router-adjacent files and build a name→path map first.

## onGenerateRoute pattern

```dart
onGenerateRoute: (settings) {
  switch (settings.name) {
    case '/login': return MaterialPageRoute(builder: (_) => LoginScreen());
    ...
  }
}
```

Regex: `case '(/[^']+)':\s*return MaterialPageRoute\(builder: .*?=> (\w+)\(`

## Widget file resolution

Once you have a widget class name (e.g. `LoginScreen`):
1. `grep -r "class LoginScreen" lib/ --include="*.dart" -l` — find the file
2. Open that file for field and button extraction
