#!/bin/bash
cd "$(dirname "$0")"
npm install
npm run readme:assets
git add docs/assets/*.png README.md package.json package-lock.json scripts/export-readme-assets.mjs
git commit -m "docs: add PNG README banner and logo assets" || true
git push origin main
echo ""
echo "Done. PNGs are in docs/assets/"
read -n 1 -s -r -p "Press any key to close..."