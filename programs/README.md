# Solana Programs

Anchor programs for the AgentSwarm protocol will live here.

## Planned Programs

| Program | Description |
|---------|-------------|
| `agent_registry` | Register, stake, and manage agent accounts |
| `swarm_governance` | Proposal creation and stake-weighted voting |
| `rewards` | Fee distribution and slashing |

## Prerequisites

```bash
# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked

# Install Solana CLI
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
```

## Status

Programs are in design phase. See [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) for the protocol specification.