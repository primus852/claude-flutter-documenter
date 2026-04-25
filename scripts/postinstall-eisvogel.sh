#!/usr/bin/env bash
set -euo pipefail

TEMPLATES_DIR="${HOME}/.local/share/pandoc/templates"
EISVOGEL_URL="https://github.com/Wandmalfarbe/pandoc-latex-template/releases/latest/download/Eisvogel.tar.gz"
EISVOGEL_DEST="${TEMPLATES_DIR}/eisvogel.latex"

echo "Installing Eisvogel template for polished PDF output..."

if [ -f "$EISVOGEL_DEST" ]; then
  echo "  ✓ eisvogel.latex already installed at $EISVOGEL_DEST"
  exit 0
fi

mkdir -p "$TEMPLATES_DIR"

TMP=$(mktemp -d)
echo "  → Downloading from GitHub releases..."
curl -fsSL "$EISVOGEL_URL" -o "$TMP/eisvogel.tar.gz"

echo "  → Extracting..."
tar -xzf "$TMP/eisvogel.tar.gz" -C "$TMP"

LATEX_FILE=$(find "$TMP" -name "eisvogel.latex" | head -1)
if [ -z "$LATEX_FILE" ]; then
  echo "ERROR: eisvogel.latex not found in archive. Check the release URL."
  exit 1
fi

cp "$LATEX_FILE" "$EISVOGEL_DEST"
rm -rf "$TMP"

echo "  ✓ eisvogel.latex installed at $EISVOGEL_DEST"
echo ""
echo "Installing required LaTeX packages (requires basictex)..."
if command -v tlmgr &>/dev/null; then
  sudo tlmgr update --self 2>/dev/null || true
  sudo tlmgr install adjustbox babel-german background bidi collectbox csquotes \
    everypage filehook footmisc footnotebackref framed fvextra letltxmacro ly1 \
    mdframed mweights needspace pagecolor sourcecodepro sourcesanspro titling \
    ucharcat ulem unicode-math upquote xecjk xurl zref 2>/dev/null || true
  echo "  ✓ LaTeX packages installed"
else
  echo "  ⚠ tlmgr not found — install basictex first: brew install --cask basictex"
fi
