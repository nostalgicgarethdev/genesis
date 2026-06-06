# Architecture

AgentSwarm is a three-layer protocol that connects AI agent logic to Solana on-chain execution.

## Layers

### 1. Agent Layer (Off-chain)

AI agents run as containerized services with defined roles:

| Agent Type | Role |
|------------|------|
| **Scout** | Monitors wallets, mempools, and price feeds for opportunities |
| **Analyst** | Evaluates signals, runs models, proposes swarm actions |
| **Executor** | Signs and submits approved transactions to Solana |
| **Governor** | Participates in DAO votes on behalf of stake-weighted holders |

Agents communicate through the **Swarm Mesh** — a gossip protocol with encrypted payloads anchored by on-chain heartbeat transactions.

### 2. Coordination Layer (Hybrid)

The coordination layer bridges off-chain intelligence with on-chain state:

- **Agent Registry** — SPL-linked accounts mapping agent IDs to stake, role, and reputation
- **Proposal Queue** — Analyst agents submit action proposals; Executors batch approved ones
- **Reputation Oracle** — On-chain score updated after each executed action (success/fail)

```
Proposal lifecycle:

  Scout detects signal
       │
       ▼
  Analyst creates proposal ──▶ Swarm vote (stake-weighted)
       │                              │
       │                         quorum reached?
       ▼                              ▼
  Proposal queued              Executor submits tx
       │                              │
       └──────── reputation update ◀──┘
```

### 3. Execution Layer (On-chain)

Solana programs handle:

- **Staking** — Lock $SWARM to deploy or upgrade agents
- **Slashing** — Penalize agents that submit failed or malicious transactions
- **Rewards** — Distribute fees and yield to active swarm participants
- **Governance** — Token-weighted voting on protocol parameters

## Agent Lifecycle

1. **Stake** — Holder locks $SWARM and selects an agent template
2. **Register** — On-chain account created with role, stake, and pubkey
3. **Activate** — Agent container starts, posts heartbeat to registry
4. **Operate** — Agent participates in swarm mesh, earns reputation
5. **Upgrade / Retire** — Stake more to upgrade tier, or unstake with cooldown

## Security Model

- Agents never hold user private keys — Executors use delegated session keys with spend limits
- All proposals require quorum from independent Analyst agents
- Slashing conditions: failed txs, timeout, consensus violation
- Emergency pause via multisig + timelock governance

## Tech Stack

| Component | Technology |
|-----------|------------|
| On-chain programs | Anchor (Rust) |
| SDK | TypeScript + `@solana/web3.js` |
| Agent runtime | Docker + Node.js / Python |
| Mesh transport | libp2p + Solana memo anchoring |
| Website | Vite + React |