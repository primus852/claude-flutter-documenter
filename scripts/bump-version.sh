#!/usr/bin/env bash
# bump-version.sh <new-version>
# Updates version in VERSION, package.json, and .claude-plugin/plugin.json,
# commits the change, and creates a signed git tag.
#
# Usage:
#   ./scripts/bump-version.sh 0.2.0
#   git push origin main && git push origin v0.2.0

set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <new-version>  (e.g. 0.2.0)"
  exit 1
fi

NEW_VERSION="$1"
TAG="v${NEW_VERSION}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Validate semver shape
if ! [[ "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "ERROR: version must be MAJOR.MINOR.PATCH (e.g. 0.2.0), got '$NEW_VERSION'"
  exit 1
fi

# Refuse to downgrade
CURRENT="$(cat "$ROOT/VERSION" | tr -d '[:space:]')"
if [[ "$NEW_VERSION" == "$CURRENT" ]]; then
  echo "Already at $CURRENT — nothing to do."
  exit 0
fi

echo "Bumping $CURRENT → $NEW_VERSION"

# 1. VERSION file
echo "$NEW_VERSION" > "$ROOT/VERSION"

# 2. package.json  (in-place with node)
node -e "
  const fs = require('fs');
  const p = '$ROOT/package.json';
  const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
  pkg.version = '$NEW_VERSION';
  fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + '\n');
  console.log('✓ package.json');
"

# 3. .claude-plugin/plugin.json
node -e "
  const fs = require('fs');
  const p = '$ROOT/.claude-plugin/plugin.json';
  const obj = JSON.parse(fs.readFileSync(p, 'utf8'));
  obj.version = '$NEW_VERSION';
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
  console.log('✓ plugin.json');
"

# 4. Commit and tag
cd "$ROOT"
git add VERSION package.json .claude-plugin/plugin.json
git commit -m "chore: bump version to $NEW_VERSION"
git tag -a "$TAG" -m "Release $TAG"

echo ""
echo "Done. To publish:"
echo "  git push origin main && git push origin $TAG"
