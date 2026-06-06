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
**http://localhost:5173/dashboard**

Or click **Continue with X**

Legacy query URLs still work: `/?view=dashboard` and `/?logged_in=1`

---

## Real X OAuth (optional)
1. Copy `.env.example` → `.env`
2. Set `X_CLIENT_ID`, `X_CLIENT_SECRET`, `X_REDIRECT_URI`
3. Set `DEV_MOCK_AUTH=false`
4. In X Developer Portal, add callback: `http://localhost:5173/api/auth/x/callback`
5. `npm run dev` — login redirects to X, then back to `/dashboard`

## Website only (no API):
```bash
cd /Users/garethlee/genesis/website
npm run dev
```
Still works — dev mode uses localStorage fallback.