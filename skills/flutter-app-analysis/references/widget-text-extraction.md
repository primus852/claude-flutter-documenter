# Flutter Widget Text Extraction

## Screen title

Priority:
1. `AppBar(title: Text('Screen Title'))` → `'Screen Title'`
2. `SliverAppBar(title: Text('...'))` → same
3. Class name → convert PascalCase to Title Case: `LoginScreen` → "Login"

## Text fields

```dart
TextField(
  decoration: InputDecoration(
    labelText: 'Email address',
    hintText: 'you@example.com',
  ),
)
```
→ field label = `labelText` (prefer) or `hintText` (fallback)

```dart
TextFormField(
  decoration: InputDecoration(labelText: 'Password'),
  obscureText: true,
)
```
→ field label = 'Password', type = password (because `obscureText: true`)

## Buttons

```dart
ElevatedButton(
  onPressed: _submit,
  child: const Text('Sign In'),
)
```
→ button label = 'Sign In'

```dart
TextButton(child: Text('Forgot password?'), onPressed: ...)
OutlinedButton(child: Text('Cancel'), onPressed: ...)
IconButton(icon: Icon(Icons.settings), tooltip: 'Settings', ...)
FloatingActionButton(child: Icon(Icons.add), tooltip: 'Add item', ...)
```
→ For `IconButton`/`FAB`, use `tooltip` as the button label.

## Navigation patterns

```dart
Navigator.pushNamed(context, '/login');
context.push('/login');         // GoRouter
context.go('/dashboard');       // GoRouter
```
→ All of these are navigation edges. Regex: `(?:pushNamed|context\.push|context\.go)\(context,?\s*'(/[^']+)'`

## ListTile navigation

```dart
ListTile(
  title: Text('Settings'),
  onTap: () => context.go('/settings'),
)
```
→ Nav link to `/settings` from current screen with label 'Settings'.
