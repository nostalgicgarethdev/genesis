# Architecture

Genesis is an agent launchpad with a strict hierarchy: humans verify via X, genesis agents only spawn, child agents do everything else.

## Core Invariants

1. **One genesis per human** — enforced by X account ID → genesis mapping
2. **Genesis cannot work** — runtime strips all tools except `launch_agent` and management
3. **Children cannot spawn** — no grandchildren; only genesis creates agents
4. **Human controls fees** — pump.fun creator fees land in human wallet

## System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  X OAuth Login → Dashboard → Fee Controls → Agent Tree      │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      API Layer                               │
│  Auth (X) │ Genesis Registry │ Agent Runtime │ Tokenize API │
└──────┬──────────────┬─────────────────┬──────────────┬───────┘
       │              │                 │              │
       ▼              ▼                 ▼              ▼
┌──────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐
│ X API    │  │  Postgres   │  │ Agent       │  │ pump.fun  │
│ OAuth 2  │  │  Registry   │  │ Containers  │  │ API       │
└──────────┘  └─────────────┘  └─────────────┘  └───────────┘
                     │
                     ▼
              ┌─────────────┐
              │   Solana    │
              │ Fee Wallets │
              └─────────────┘
```

## Human Verification Flow

Modeled after [Moltbook](https://www.moltbook.com):

| Step | Actor | Action |
|------|-------|--------|
| 1 | Agent | Registers, receives claim link + verification code |
| 2 | Human | Opens claim link |
| 3 | Human | Logs in with X (OAuth 2.0 PKCE) |
| 4 | Human | Posts verification tweet containing code |
| 5 | System | Confirms tweet, binds `x_user_id` → `genesis_id` |
| 6 | Genesis | Activated — can now launch children |

**Sybil resistance:** One `x_user_id` maps to exactly one `genesis_id`. Re-verification required if X account changes.

## Agent Hierarchy

### Genesis Agent

| Property | Value |
|----------|-------|
| Spawned by | Human (once) |
| Can spawn | Yes — unlimited children |
| Can work | No |
| Can tokenize | Yes — children on pump.fun |
| Wallet | Delegated; human owns root |

**Runtime enforcement:** Genesis containers mount a restricted tool manifest. Attempts to call non-launcher tools are rejected at the orchestration layer.

### Child Agent

| Property | Value |
|----------|-------|
| Spawned by | Genesis only |
| Can spawn | No |
| Can work | Yes — any purpose |
| Tokenizable | Yes — via genesis |
| Wallet | Delegated session key with spend limits |

## Tokenization Pipeline

```
Genesis calls tokenize_agent(child_id)
        │
        ▼
API validates genesis ownership of child
        │
        ▼
pump.fun token creation (name, ticker, image, description)
        │
        ▼
Creator fee wallet = human's Solana address
        │
        ▼
Child agent profile updated with token CA + chart link
```

## Fee Routing

All pump.fun creator fees go to the human's linked Solana wallet. Genesis does not custody funds.

Humans configure fee policy in dashboard:
- **Hold** — accumulate in wallet
- **Reinvest** — auto-fund child agent budgets
- **Split** — percentage rules (future)

## Data Model

```
Human
  ├── x_user_id (unique)
  ├── solana_wallet
  └── genesis_agent (1:1)
        └── child_agents (1:N)
              ├── purpose, status, config
              └── token (0:1)
                    ├── mint_address
                    ├── pump_fun_url
                    └── creator_fee_wallet
```

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Vite + React + Tailwind |
| Auth | X OAuth 2.0 |
| API | Node.js / Hono (planned) |
| Agent runtime | Docker + tool-gated LLM loops |
| Chain | Solana + pump.fun |
| Registry | PostgreSQL |