#!/usr/bin/env bash
set -euo pipefail

echo "claude-documenter — installing system dependencies"
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

install_cask_if_missing() {
  local cask="$1"
  local check_cmd="$2"
  if command -v "$check_cmd" &>/dev/null; then
    echo "  ✓ $cask already installed"
  else
    echo "  → Installing $cask (cask)..."
    brew install --cask "$cask"
  fi
}

echo ""
echo "Core rendering tools:"
install_if_missing pandoc
install_if_missing typst

echo ""
echo "Diagrams:"
install_if_missing mermaid-cli mmdc

echo ""
echo "LaTeX (for Eisvogel polished PDF — ~100MB):"
install_cask_if_missing basictex xelatex

echo ""
echo "Node.js (for Playwright and analysis CLI):"
install_if_missing node

echo ""
echo "All system dependencies installed."
echo ""
echo "Next steps:"
echo "  1. Run: npm install  (in the claude-documenter directory)"
echo "  2. Run: ./scripts/postinstall-eisvogel.sh  (for polished PDF support)"
echo "  3. In Claude Code: /plugin marketplace add ~/path/to/claude-documenter"
