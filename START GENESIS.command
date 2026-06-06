#!/bin/bash
cd "$(dirname "$0")"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
export DEV_MOCK_AUTH=true

echo ""
echo "  ╔════════════════════════════════════╗"
echo "  ║         STARTING GENESIS           ║"
echo "  ╚════════════════════════════════════╝"
echo ""

# Kill stuck processes
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
sleep 1

# Install deps if missing
if [ ! -d "node_modules/hono" ] || [ ! -d "website/node_modules/vite" ]; then
  echo "  Installing dependencies (first time only)..."
  npm install || { echo "npm install failed"; read -p "Press Enter..."; exit 1; }
fi

echo "  Starting API..."
(cd api && npx tsx watch --ignore 'data/**' src/index.ts) &
API_PID=$!

echo "  Starting website..."
(cd website && npm run dev) &
WEB_PID=$!

echo ""
echo "  Waiting for servers..."
sleep 5

echo "  Opening browser..."
open "http://localhost:5173/ping.html"
sleep 1
open "http://localhost:5173/"

echo ""
echo "  ✓ Genesis should be open in your browser"
echo "  ✓ Home:      http://localhost:5173/"
echo "  ✓ Dashboard: http://localhost:5173/?view=dashboard"
echo ""
echo "  KEEP THIS WINDOW OPEN — closing it stops Genesis"
echo "  Press Ctrl+C to stop"
echo ""

trap "kill $API_PID $WEB_PID 2>/dev/null; exit" SIGINT SIGTERM
wait