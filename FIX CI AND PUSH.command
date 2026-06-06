#!/bin/bash
cd "$(dirname "$0")"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

echo ""
echo "  Genesis — fix CI and force-push to GitHub"
echo ""

echo "  Remote:"
git remote -v
echo ""

# --- Write website/package.json (full file, no ambiguity) ---
cat > website/package.json << 'EOF'
{
  "name": "website",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && npx --yes vite@6.3.5 build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.6",
    "react-dom": "^19.2.6"
  },
  "devDependencies": {
    "@eslint/js": "^9.17.0",
    "@tailwindcss/vite": "4.0.0",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "4.3.4",
    "eslint": "^9.17.0",
    "eslint-plugin-react-hooks": "^5.1.0",
    "eslint-plugin-react-refresh": "^0.4.16",
    "globals": "^15.14.0",
    "tailwindcss": "^4.0.0",
    "typescript": "~5.7.2",
    "typescript-eslint": "^8.18.0",
    "vite": "6.3.5"
  }
}
EOF
echo "  ✓ website/package.json"
grep '"build"' website/package.json

# --- Write deploy workflow ---
mkdir -p .github/workflows
cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: website
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install and build website
        env:
          GITHUB_PAGES: true
        run: |
          if [ -f ../package.json ]; then mv ../package.json ../_package.json.workspace; fi
          if [ -f ../package-lock.json ]; then mv ../package-lock.json ../_package-lock.json.workspace; fi

          rm -rf node_modules package-lock.json
          npm install

          VITE_VER=$(node -p "require('./node_modules/vite/package.json').version")
          echo "vite version: $VITE_VER"
          test "$VITE_VER" = "6.3.5"

          npm run build

          if [ -f ../_package.json.workspace ]; then mv ../_package.json.workspace ../package.json; fi
          if [ -f ../_package-lock.json.workspace ]; then mv ../_package-lock.json.workspace ../package-lock.json; fi

      - name: Add SPA fallback
        working-directory: .
        run: cp website/dist/index.html website/dist/404.html

      - uses: actions/upload-pages-artifact@v3
        with:
          path: website/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
EOF
echo "  ✓ .github/workflows/deploy.yml"
grep "Install and build" .github/workflows/deploy.yml

echo ""
echo "  What git sees:"
git diff website/package.json .github/workflows/deploy.yml | head -30
echo ""

git add -f website/package.json .github/workflows/deploy.yml "FIX CI AND PUSH.command"

if git diff --cached --quiet; then
  echo "  WARNING: git still sees no changes vs last commit."
  echo "  Last commit build script:"
  git show HEAD:website/package.json 2>/dev/null | grep '"build"' || true
  echo ""
  echo "  Forcing empty commit to trigger CI..."
  git commit --allow-empty -m "chore: retrigger GitHub Pages deploy"
else
  git commit -m "fix(ci): force vite@6.3.5 build for GitHub Pages"
fi

echo ""
echo "  Pushing..."
git push origin main
echo ""

echo "  Verify on GitHub (wait 10 sec then check):"
echo "  curl -s https://raw.githubusercontent.com/nostalgicgarethdev/genesis/main/website/package.json | grep build"
sleep 3
curl -s "https://raw.githubusercontent.com/nostalgicgarethdev/genesis/main/website/package.json?t=$(date +%s)" | grep '"build"' || true
echo ""
echo "  Actions: https://github.com/nostalgicgarethdev/genesis/actions"
echo ""
read -p "Press Enter to close..."