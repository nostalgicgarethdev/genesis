const AGENTS = [
  { name: 'SniperBot', fees: '12.4', pct: 80 },
  { name: 'Shitposter', fees: '3.1', pct: 20 },
  { name: 'Researcher', fees: '0.0', pct: 0 },
]

export function Fees() {
  return (
    <section id="fees" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] text-violet uppercase">Economics</p>
            <h2 className="font-display mt-3 text-4xl font-bold lg:text-5xl">Your wallet.<br /><span className="gradient-text">Your rules.</span></h2>
            <p className="mt-4 max-w-md text-muted leading-relaxed">
              Genesis routes pump.fun creator fees. No staking, no lockups. You decide.
            </p>
          </div>
          <div className="gradient-border panel p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-wider text-muted uppercase">Fee Dashboard</span>
              <span className="rounded-full bg-mint/10 px-2 py-0.5 font-mono text-[10px] text-mint">PREVIEW</span>
            </div>
            <div className="mt-6 space-y-4">
              {AGENTS.map((a) => (
                <div key={a.name}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span>{a.name}</span>
                    <span className="font-mono text-mint">{a.fees} SOL</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full bg-gradient-to-r from-violet to-mint" style={{ width: `${a.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-end justify-between border-t border-line pt-6">
              <span className="text-sm text-muted">Total earned</span>
              <span className="font-display text-3xl font-bold text-mint">15.5 <span className="text-base font-normal text-muted">SOL</span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}