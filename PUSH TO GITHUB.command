#!/bin/bash
cd "$(dirname "$0")"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

echo ""
echo "  Pushing Genesis to GitHub..."
echo ""

git add -A
git status

read -p "  Commit message [Genesis launch]: " MSG
MSG=${MSG:-Genesis launch}
git commit -m "$MSG" 2>/dev/null || echo "  (nothing new to commit)"

if ! command -v gh &>/dev/null; then
  echo ""
  echo "  Install GitHub CLI: brew install gh && gh auth login"
  echo "  Or follow manual steps in GITHUB.md"
  read -p "Press Enter..."
  exit 1
fi

gh auth status || gh auth login

gh repo view garethlee/genesis &>/dev/null && \
  git push origin main || \
  gh repo create genesis --public --source=. --remote=origin --push

echo ""
echo "  ✓ Code pushed!"
echo ""
echo "  Next: enable GitHub Pages"
echo "  → github.com/garethlee/genesis/settings/pages"
echo "  → Source: GitHub Actions"
echo ""
echo "  Live site (after deploy):"
echo "  → https://garethlee.github.io/genesis/"
echo ""
read -p "Press Enter..."