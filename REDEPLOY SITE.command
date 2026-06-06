#!/bin/bash
cd "$(dirname "$0")"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

echo ""
echo "  Genesis — redeploy site (VITE_API_URL → Render API)"
echo ""

if command -v gh &>/dev/null && gh auth status &>/dev/null; then
  echo "  Triggering GitHub Actions workflow..."
  gh workflow run "Deploy to GitHub Pages" --repo nostalgicgarethdev/genesis
  sleep 5
  gh run list --repo nostalgicgarethdev/genesis --workflow "Deploy to GitHub Pages" --limit 3
else
  echo "  gh not available — pushing empty commit to main..."
  git commit --allow-empty -m "chore: redeploy site with VITE_API_URL"
  git push origin main
fi

echo ""
echo "  Actions: https://github.com/nostalgicgarethdev/genesis/actions"
echo "  Live site: https://nostalgicgarethdev.github.io/genesis/"
echo ""
read -p "Press Enter to close..."