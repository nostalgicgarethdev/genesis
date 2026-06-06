# Push Genesis to GitHub + Live Website

## Step 1 — Create GitHub repo & push code

Open **Terminal** and paste:

```bash
cd /Users/garethlee/genesis

# Commit everything
git add -A
git commit -m "Genesis: AI agent launchpad — website, API, docs"

# Create repo and push (requires GitHub CLI)
brew install gh 2>/dev/null
gh auth login
gh repo create genesis --public --source=. --remote=origin --push
```

**No GitHub CLI?** Manual way:
1. Go to https://github.com/new
2. Name: `genesis` → Public → Create
3. Then run:
```bash
cd /Users/garethlee/genesis
git add -A
git commit -m "Genesis launch"
git remote add origin https://github.com/YOUR_USERNAME/genesis.git
git branch -M main
git push -u origin main
```

---

## Step 2 — Enable GitHub Pages

1. Go to **https://github.com/YOUR_USERNAME/genesis/settings/pages**
2. Under **Build and deployment** → Source: **GitHub Actions**
3. Push to `main` triggers auto-deploy (or run workflow manually)

---

## Step 3 — Your live website

After deploy completes (~2 min):

### **https://nostalgicgarethdev.github.io/genesis/**

Dashboard: **https://YOUR_USERNAME.github.io/genesis/dashboard**

---

## What works online

| Feature | GitHub Pages |
|---------|--------------|
| Landing page | ✅ |
| Login (demo mode) | ✅ localStorage |
| Dashboard + spawn | ✅ localStorage |
| Real X OAuth | ❌ needs API host |
| pump.fun live | ❌ Phase 3 |

To add real OAuth later, deploy the `api/` folder to Railway or Render.

---

## Repo structure

```
genesis/
├── website/     ← React landing page (deployed to Pages)
├── api/         ← OAuth + agents API (local/Railway)
├── sdk/         ← TypeScript SDK
├── docs/        ← Architecture, fees, roadmap
└── skill.md     ← Agent onboarding
```