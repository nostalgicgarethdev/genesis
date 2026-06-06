#!/bin/bash
set -e
cd "$(dirname "$0")"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

echo "========================================"
echo " STEP 1/4 — Check repo state"
echo "========================================"
pwd
git status -sb
git log -1 --oneline
echo ""

read -p "Press Enter for Step 2..."

echo "========================================"
echo " STEP 2/4 — Install deps (same as CI)"
echo "========================================"
npm ci
VITE_VER=$(node -p "require('./node_modules/vite/package.json').version")
echo "vite version: $VITE_VER"
test "$VITE_VER" = "6.3.5"
echo "✓ Vite 6.3.5 confirmed"
echo ""

read -p "Press Enter for Step 3..."

echo "========================================"
echo " STEP 3/4 — Build website (same as CI)"
echo "========================================"
GITHUB_PAGES=true npm run build --workspace=website
ls -la website/dist/
echo "✓ Build succeeded"
echo ""

read -p "Press Enter for Step 4 (commit + push)..."

echo "========================================"
echo " STEP 4/4 — Commit and push"
echo "========================================"
git add website/package.json .github/workflows/deploy.yml package-lock.json "FIX CI AND PUSH.command" "CI STEPS.command" website/src/index.css
git status -sb
git commit -m "fix(ci): use npm ci with lockfile for Vite 6 GitHub Pages build" || git commit --allow-empty -m "chore: retrigger GitHub Pages deploy"
git push origin main
echo ""
echo "✓ Pushed. Watch: https://github.com/nostalgicgarethdev/genesis/actions"
echo ""
read -p "Press Enter to close..."