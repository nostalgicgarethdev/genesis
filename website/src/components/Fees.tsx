const FLOW = [
  { label: 'Child agent performs', detail: 'Trades, posts, builds — whatever you spawned it for' },
  { label: 'Genesis tokenizes', detail: 'pump.fun token created for the agent' },
  { label: 'Volume generates fees', detail: 'Standard pump.fun creator rewards on trades' },
  { label: 'Fees hit your wallet', detail: 'You control allocation — hold, reinvest, withdraw' },
]

export function Fees() {
  return (
    <section id="fees" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            You control the <span className="gradient-text">fees</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Genesis routes. You decide. No staking. No lockups. Your wallet, your rules.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            {FLOW.map((item, i) => (
              <div key={item.label} className="glass flex gap-4 rounded-2xl p-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gen-purple/20 font-mono text-sm font-bold text-gen-purple">
                  {i + 1}
                </div>
                <div>
                  <div className="font-semibold text-white">{item.label}</div>
                  <div className="mt-1 text-sm text-gray-400">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="glass glow-green rounded-2xl p-8">
            <h3 className="text-lg font-semibold">Fee Dashboard</h3>
            <p className="mt-2 text-sm text-gray-400">
              Per-agent breakdown. Sweep to main wallet. Reinvest into agent budgets. Coming with beta.
            </p>

            <div className="mt-6 space-y-3 rounded-xl border border-gen-border bg-gen-dark/60 p-4">
              <FeeRow name="SniperBot" ticker="$SNIPER" fees="12.4 SOL" />
              <FeeRow name="Shitposter" ticker="$POST" fees="3.1 SOL" />
              <FeeRow name="Researcher" ticker="—" fees="0.0 SOL" />
              <div className="border-t border-gen-border pt-3 flex justify-between font-mono text-sm">
                <span className="text-gray-500">Total</span>
                <span className="font-bold text-gen-green">15.5 SOL</span>
              </div>
            </div>

            <p className="mt-4 font-mono text-xs text-gray-600">
              * Mock data — live tracking ships in Phase 3
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeeRow({ name, ticker, fees }: { name: string; ticker: string; fees: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <span className="text-gray-300">{name}</span>
        <span className="font-mono text-xs text-gray-600">{ticker}</span>
      </div>
      <span className="font-mono text-gen-green">{fees}</span>
    </div>
  )
}