# AgentSwarm Protocol

**Autonomous AI agent swarms on Solana — powered by $SWARM**

AgentSwarm is an open protocol for deploying, coordinating, and incentivizing autonomous AI agents on Solana. Stake $SWARM to spawn specialized agents that execute on-chain strategies — from portfolio rebalancing to DAO governance — as a collective swarm intelligence.

[![Website](https://img.shields.io/badge/website-agentswarm.io-9945FF?style=flat-square)](https://agentswarm.io)
[![Solana](https://img.shields.io/badge/built%20on-Solana-14F195?style=flat-square)](https://solana.com)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

## What is AgentSwarm?

Traditional crypto bots are single-purpose scripts. AgentSwarm introduces **swarm intelligence** — networks of AI agents that:

- **Deploy** on-chain with a single stake transaction
- **Coordinate** via encrypted message passing on Solana
- **Vote** on collective strategies weighted by $SWARM stake
- **Execute** sub-second on-chain actions with minimal fees

```
┌─────────────┐     stake $SWARM     ┌──────────────────┐
│   Holder    │ ──────────────────▶  │  Agent Registry  │
└─────────────┘                      └────────┬─────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    ▼                         ▼                         ▼
              ┌──────────┐            ┌──────────┐            ┌──────────┐
              │ Scout    │◀──────────▶│ Analyst  │◀──────────▶│ Executor │
              │ Agent    │   swarm    │ Agent    │   swarm    │ Agent    │
              └──────────┘   mesh     └──────────┘   mesh     └──────────┘
                    │                         │                         │
                    └─────────────────────────┼─────────────────────────┘
                                              ▼
                                    ┌──────────────────┐
                                    │  Solana Programs │
                                    │  (DEX, DAO, etc) │
                                    └──────────────────┘
```

## Repository Structure

```
agentswarm/
├── website/          # Landing page (Vite + React)
├── sdk/              # TypeScript SDK for agent deployment
├── programs/         # Solana Anchor programs (coming soon)
└── docs/             # Architecture, tokenomics, roadmap
```

## Quick Start

### Website (local dev)

```bash
cd website
npm install
npm run dev
```

### SDK

```bash
cd sdk
npm install
npm run build
```

```typescript
import { AgentSwarmClient } from '@agentswarm/sdk';

const client = new AgentSwarmClient({
  rpcUrl: 'https://api.mainnet-beta.solana.com',
});

// Deploy a scout agent (mainnet coming soon)
const agent = await client.deployAgent({
  type: 'scout',
  stakeAmount: 1000, // $SWARM
});
```

## Token — $SWARM

| Property       | Value                    |
|----------------|--------------------------|
| Chain          | Solana (SPL)             |
| Total Supply   | 1,000,000,000            |
| Ticker         | $SWARM                   |

See [docs/TOKENOMICS.md](docs/TOKENOMICS.md) for full distribution and utility details.

## Roadmap

| Phase | Milestone                                      | Status      |
|-------|------------------------------------------------|-------------|
| 1     | Token launch + landing page                    | In Progress |
| 2     | Agent registry program (Anchor)                | Planned     |
| 3     | Scout + Analyst agent templates                | Planned     |
| 4     | Swarm coordination layer                       | Planned     |
| 5     | DAO governance via agent voting                | Planned     |

Full roadmap: [docs/ROADMAP.md](docs/ROADMAP.md)

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — protocol design and agent lifecycle
- [Tokenomics](docs/TOKENOMICS.md) — $SWARM distribution and utility
- [Roadmap](docs/ROADMAP.md) — development phases

## Contributing

Contributions welcome. Open an issue or PR to discuss agent templates, program improvements, or SDK features.

## License

MIT — see [LICENSE](LICENSE).

---

**AgentSwarm** — *Mint intelligence. Deploy swarms.*