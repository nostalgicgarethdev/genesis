# Genesis — How to Start

## Step 1 — Terminal
```bash
cd /Users/garethlee/genesis
npm run kill
npm run dev
```

**Keep terminal open.** Wait for:
```
VITE v8.x  ready
➜  Local:   http://localhost:5173/
```

## Step 2 — Test server works
Open: **http://localhost:5173/ping.html**

If you see "Genesis server is running" → server is fine.

## Step 3 — Open app
**http://localhost:5173/**

## Step 4 — Dashboard
**http://localhost:5173/?view=dashboard**

Or click **Login with X**

---

## NEVER use these (they 404):
- ~~http://localhost:5173/dashboard~~
- ~~http://localhost:5173/#/dashboard~~

## Website only (no API):
```bash
cd /Users/garethlee/genesis/website
npm run dev
```
Still works — dev mode uses localStorage fallback.