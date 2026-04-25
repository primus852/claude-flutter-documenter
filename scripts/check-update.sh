#!/usr/bin/env bash
# Prints "flutter-doc vX.Y.Z available" if a newer release exists on GitHub.
# Prints nothing if current or if the check cannot complete.
# Designed to be used as a Claude Code statusline command or Stop hook.
#
# Usage:
#   PLUGIN_ROOT=~/path/to/claude-flutter-documenter ./scripts/check-update.sh

set -euo pipefail

PLUGIN_ROOT="${PLUGIN_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"
VERSION_FILE="$PLUGIN_ROOT/VERSION"

[[ -f "$VERSION_FILE" ]] || exit 0

CURRENT="$(cat "$VERSION_FILE" | tr -d '[:space:]')"

# Fetch latest release tag from GitHub (5s timeout, silent on error)
LATEST="$(curl -sf --max-time 5 \
  https://api.github.com/repos/primus852/claude-flutter-documenter/releases/latest \
  | grep '"tag_name"' \
  | sed 's/.*"tag_name": *"v\([^"]*\)".*/\1/' \
  2>/dev/null || true)"

[[ -z "$LATEST" ]] && exit 0
[[ "$LATEST" == "$CURRENT" ]] && exit 0

# Simple semver comparison: split into parts and compare numerically
version_gt() {
  local a="$1" b="$2"
  IFS='.' read -r a1 a2 a3 <<< "$a"
  IFS='.' read -r b1 b2 b3 <<< "$b"
  [[ $a1 -gt $b1 ]] && return 0
  [[ $a1 -eq $b1 && $a2 -gt $b2 ]] && return 0
  [[ $a1 -eq $b1 && $a2 -eq $b2 && $a3 -gt $b3 ]] && return 0
  return 1
}

if version_gt "$LATEST" "$CURRENT"; then
  echo "flutter-doc v${LATEST} available → /plugin update flutter-doc"
fi
