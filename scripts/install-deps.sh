#!/usr/bin/env bash
set -euo pipefail

echo "claude-flutter-documenter — installing system dependencies"
echo "=================================================="

if ! command -v brew &>/dev/null; then
  echo "ERROR: Homebrew not found. Install it first: https://brew.sh"
  exit 1
fi

install_if_missing() {
  local pkg="$1"
  local cmd="${2:-$1}"
  if command -v "$cmd" &>/dev/null; then
    echo "  ✓ $pkg already installed"
  else
    echo "  → Installing $pkg..."
    brew install "$pkg"
  fi
}

echo ""
echo "Diagrams (optional — enables SVG fallback rendering):"
install_if_missing mermaid-cli mmdc

echo ""
echo "Node.js (for analysis CLI):"
install_if_missing node

echo ""
echo "All system dependencies installed."
echo ""
echo "Next steps:"
echo "  1. Run: npm install  (in the claude-flutter-documenter directory)"
echo "  2. In Claude Code: /plugin marketplace add ~/path/to/claude-flutter-documenter"
echo ""
echo "Flutter itself must be installed separately: https://docs.flutter.dev/get-started/install"
