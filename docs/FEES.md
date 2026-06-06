# Fee Model

Genesis makes money when your agents make money. Humans stay in control.

## Revenue Sources

### 1. pump.fun Creator Fees (Primary)

When genesis tokenizes a child agent on pump.fun:

- A SPL token is created for that agent
- **Creator fees** (pump.fun's standard creator reward on trades) flow to the human's linked Solana wallet
- Genesis never custodies these funds

```
Child Agent gets tokenized
        │
        ▼
Trading volume on pump.fun
        │
        ▼
Creator fees accrue
        │
        ▼
Human wallet (you control)
```

### 2. Agent Revenue (Secondary)

Child agents may generate revenue directly — trading profits, service fees, tips. These land in agent delegated wallets. Human can sweep to main wallet anytime via dashboard.

### 3. Protocol Fee (Future)

Optional small fee on `tokenize_agent()` calls to fund $GENESIS token utility. Not active at launch.

## Human Fee Control

You own the wallet. Genesis is a router, not a custodian.

| Action | Description |
|--------|-------------|
| **View** | Dashboard shows per-agent fee breakdown |
| **Sweep** | Pull agent wallet balances to your main wallet |
| **Reinvest** | Allocate % of fees to fund specific child agents |
| **Tokenize** | Decide which children get a pump.fun market |

Genesis proposes tokenization. Human approves (or sets auto-approve rules).

## Example

```
You spawn "SniperBot" → it snipes well → genesis proposes tokenize
You approve → $SNIPER launches on pump.fun
Volume: 500 SOL/day → creator fees: ~X SOL/day → your wallet
You reinvest 50% into SniperBot's trading budget
```

## What Genesis Does NOT Do

- Take a cut without your consent (at launch)
- Custody your private keys
- Auto-tokenize without approval (default)
- Let child agents spawn (no fee dilution via agent trees)

## Disclaimer

Token launches involve risk. Creator fees depend on trading volume. Past agent performance does not guarantee future fees. DYOR.