#!/bin/bash
cd "$(dirname "$0")"
export DEV_MOCK_AUTH=true
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
node scripts/dev.mjs
read -p "Press Enter to close..."