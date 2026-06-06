# Deploy API to Render (free)

Host the Genesis API on [Render](https://render.com) so **Continue with X** uses real OAuth on the live site.

## Architecture

| Piece | Host | URL |
|-------|------|-----|
| Website | GitHub Pages | `https://nostalgicgarethdev.github.io/genesis` |
| API | Render (free) | `https://genesis-api.onrender.com` |
| OAuth callback | X Developer Portal | `https://genesis-api.onrender.com/api/auth/x/callback` |

## 1 — Deploy API on Render

1. Go to [dashboard.render.com](https://dashboard.render.com) → sign in with GitHub.
2. **New +** → **Blueprint** → connect repo `nostalgicgarethdev/genesis`.
3. Render reads `render.yaml` and creates service **genesis-api**.
4. When prompted, set secrets:
   - `X_CLIENT_ID` — from [X Developer Portal](https://developer.x.com/en/portal/dashboard)
   - `X_CLIENT_SECRET` — same app
5. Click **Apply**. Wait for the first deploy (~3–5 min).
6. Confirm health: `https://genesis-api.onrender.com/api/health` → `{"status":"ok",...}`

`SESSION_SECRET` is auto-generated. `FRONTEND_URL` and `X_REDIRECT_URI` are set in `render.yaml`.

## 2 — X Developer Portal

In your X app → **User authentication settings**:

| Field | Value |
|-------|--------|
| Type | Web App, OAuth 2.0 |
| Callback URL | `https://genesis-api.onrender.com/api/auth/x/callback` |
| Website URL | `https://nostalgicgarethdev.github.io/genesis` |

Copy **Client ID** and **Client Secret** into Render env vars if not done already.

## 3 — Wire the website

The GitHub Actions workflow already builds with:

```
VITE_API_URL=https://genesis-api.onrender.com
```

Override in repo **Settings → Secrets and variables → Actions → Variables**:

| Name | Value |
|------|--------|
| `VITE_API_URL` | `https://genesis-api.onrender.com` (or your Render URL if renamed) |

Push to `main` to redeploy the site, or re-run the **Deploy to GitHub Pages** workflow.

## 4 — Test end-to-end

1. Open [nostalgicgarethdev.github.io/genesis](https://nostalgicgarethdev.github.io/genesis)
2. Click **Continue with X**
3. You should land on X login (not mock dev user)
4. After auth → `/genesis/dashboard` with your real X profile

**Note:** Render free tier sleeps after ~15 min idle. First login after sleep may take 30–60s while the API wakes up.

## Local dev (unchanged)

```bash
npm run dev
```

Uses Vite proxy to `localhost:3001`. Mock auth when `DEV_MOCK_AUTH=true` in `.env`.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Redirect loop / not logged in on dashboard | Check `FRONTEND_URL` on Render matches GitHub Pages URL exactly |
| `token_exchange` error | Verify `X_REDIRECT_URI` matches X portal callback exactly |
| Still shows Dev User | Site built without `VITE_API_URL` — redeploy workflow |
| API 502 on first request | Free tier cold start — wait and retry |

## Data persistence

The API uses `api/data/store.json`. On Render free tier this resets on redeploy. Fine for demos; use Postgres (e.g. Supabase free tier) for production.