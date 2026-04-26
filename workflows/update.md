# flutter-doc update workflow

## 1. Detect installed version

Read the installed version from the plugin registry:

```bash
python3 -c "
import json, os
path = os.path.expanduser('~/.claude/plugins/installed_plugins.json')
d = json.load(open(path))
entry = d.get('plugins', {}).get('flutter-doc@claude-flutter-documenter-marketplace', [{}])[0]
print(entry.get('version', 'unknown'))
"
```

## 2. Fetch latest release from GitHub

```bash
curl -sf --max-time 10 \
  https://api.github.com/repos/primus852/claude-flutter-documenter/releases/latest \
  | grep '"tag_name"' \
  | sed 's/.*"tag_name": *"v\([^"]*\)".*/\1/'
```

If the curl fails (offline / no releases), report: "Could not reach GitHub — check your network and try again." and stop.

## 3. Compare versions

- If installed == latest: report "flutter-doc is up to date (v<version>)." and stop.
- If latest is newer: continue.

## 4. Fetch changelog for the new version

```bash
curl -sf --max-time 10 \
  https://api.github.com/repos/primus852/claude-flutter-documenter/releases/latest \
  | python3 -c "import json,sys; r=json.load(sys.stdin); print(r.get('body','No release notes.'))"
```

Display the result to the user under a `## What's new in v<latest>` heading.

## 5. Ask for confirmation

Use AskUserQuestion: "Install flutter-doc v<latest>? This will update the plugin files. (yes / no)"

If the user says no: stop with "Update cancelled."

## 6. Update the plugin

Run these commands in sequence:

```bash
# Pull latest into the marketplace clone
cd ~/.claude/plugins/marketplaces/claude-flutter-documenter-marketplace && git pull origin main
```

```bash
# Re-copy plugin content into cache (resolve symlinks with -L)
LATEST_TAG=$(curl -sf --max-time 10 \
  https://api.github.com/repos/primus852/claude-flutter-documenter/releases/latest \
  | grep '"tag_name"' | sed 's/.*"tag_name": *"v\([^"]*\)".*/\1/')
SRC=~/.claude/plugins/marketplaces/claude-flutter-documenter-marketplace
CACHE=~/.claude/plugins/cache/claude-flutter-documenter-marketplace/flutter-doc/$LATEST_TAG
mkdir -p "$CACHE/.claude-plugin"
cp -RL "$SRC/commands"   "$CACHE/"
cp -RL "$SRC/skills"     "$CACHE/"
cp -RL "$SRC/agents"     "$CACHE/"
cp -RL "$SRC/workflows"  "$CACHE/"
cp -RL "$SRC/templates"  "$CACHE/"
cp "$SRC/.claude-plugin/plugin.json" "$CACHE/.claude-plugin/"
echo "$CACHE"
```

```bash
# Update installed_plugins.json with the new version and path
python3 - <<'PYEOF'
import json, os, datetime

registry_path = os.path.expanduser('~/.claude/plugins/installed_plugins.json')
cache_base = os.path.expanduser('~/.claude/plugins/cache/claude-flutter-documenter-marketplace/flutter-doc')

# Find the newest version directory in cache
versions = sorted(os.listdir(cache_base)) if os.path.exists(cache_base) else []
if not versions:
    print("ERROR: no version directories found in cache")
    exit(1)
latest_dir = versions[-1]
install_path = os.path.join(cache_base, latest_dir)

d = json.load(open(registry_path))
now = datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.000Z')
d['plugins']['flutter-doc@claude-flutter-documenter-marketplace'] = [{
    'scope': 'user',
    'installPath': install_path,
    'version': latest_dir,
    'installedAt': now,
    'lastUpdated': now,
}]
json.dump(d, open(registry_path, 'w'), indent=2)
print(f"Registered flutter-doc {latest_dir}")
PYEOF
```

## 7. Report success

Print: "✓ flutter-doc updated to v<latest>. Restart Claude Code to apply the new version."
