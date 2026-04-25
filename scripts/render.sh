#!/usr/bin/env bash
# Convenience wrapper: render.sh <manual.md> <format> [style]
# Example: render.sh .documenter/manual.md all eisvogel
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_ROOT="$(dirname "$SCRIPT_DIR")"

INPUT="${1:-.documenter/manual.md}"
FORMAT="${2:-all}"
STYLE="${3:-typst}"

node "$PLUGIN_ROOT/bin/documenter.cjs" render "$INPUT" "$FORMAT" "$STYLE"
