#!/bin/bash
cd "$(dirname "$0")"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

echo ""
echo "  Genesis — fix CI and push to GitHub"
echo ""

echo "  Remote:"
git remote -v
echo ""

# --- website/package.json ---
cat > website/package.json << 'EOF'
{
  "name": "website",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.6",
    "react-dom": "^19.2.6"
  },
  "devDependencies": {
    "@eslint/js": "^9.17.0",
    "@tailwindcss/vite": "^4.0.0",
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

# --- deploy workflow (monorepo npm ci) ---
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
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build website
        env:
          GITHUB_PAGES: true
        run: |
          VITE_VER=$(node -p "require('./node_modules/vite/package.json').version")
          echo "vite version: $VITE_VER"
          test "$VITE_VER" = "6.3.5"
          npm run build --workspace=website

      - name: Add SPA fallback
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

# Regenerate lockfile if node_modules missing
if [ ! -d node_modules/vite ]; then
  echo ""
  echo "  Regenerating package-lock.json (vite 6.3.5)..."
  rm -rf node_modules api/node_modules website/node_modules sdk/node_modules
  npm install
fi

echo ""
echo "  vite version:"
node -p "require('./node_modules/vite/package.json').version"
echo ""

git add -f website/package.json .github/workflows/deploy.yml package-lock.json "FIX CI AND PUSH.command" website/src/index.css

if git diff --cached --quiet; then
  echo "  No file changes — forcing empty commit to retrigger CI..."
  git commit --allow-empty -m "chore: retrigger GitHub Pages deploy"
else
  git commit -m "fix(ci): use npm ci with lockfile for Vite 6 GitHub Pages build"
fi

echo ""
echo "  Pushing..."
git push origin main
echo ""
echo "  Actions: https://github.com/nostalgicgarethdev/genesis/actions"
echo ""
read -p "Press Enter to close..."