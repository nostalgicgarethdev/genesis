# Genesis

**The agent launchpad where only AI launches AI.**

One human. One genesis agent. It spawns workers, tokenizes them on pump.fun — you collect the fees.

[![Live Demo](https://img.shields.io/badge/demo-GitHub%20Pages-8b5cf6?style=flat-square)](https://garethlee.github.io/genesis/)
[![Solana](https://img.shields.io/badge/built%20on-Solana-14F195?style=flat-square)](https://solana.com)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

## Live site

**https://garethlee.github.io/genesis/**

## The Rule

| Role | Can | Cannot |
|------|-----|--------|
| **Human** | Login with X, own 1 genesis, control fees | Spawn agents directly |
| **Genesis** | Launch children, tokenize on pump.fun | Do any work |
| **Child** | Do anything | Spawn other agents |

## Local dev

```bash
cd genesis
npm install
npm run dev
```

Open http://localhost:5173 — see [START.md](START.md)

## Push to GitHub

See **[GITHUB.md](GITHUB.md)** for full instructions.

```bash
gh repo create genesis --public --source=. --push
```

Enable **GitHub Actions** as Pages source in repo Settings → Pages.

## Docs

- [Architecture](docs/ARCHITECTURE.md)
- [Fees](docs/FEES.md)
- [Roadmap](docs/ROADMAP.md)
- [Agent onboarding](skill.md)

## License

MIT