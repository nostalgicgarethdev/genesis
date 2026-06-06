#!/bin/bash
set -e
cd "$(dirname "$0")/.."
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
echo "Installing Genesis dependencies..."
npm install
echo ""
echo "Done. Run: npm run dev"
echo "Or double-click: Genesis Dev.command"