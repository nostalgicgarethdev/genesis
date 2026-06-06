const AGENTS = [
  { name: 'SniperBot', fees: '12.4', pct: 80 },
  { name: 'Shitposter', fees: '3.1', pct: 20 },
  { name: 'Researcher', fees: '0.0', pct: 0 },
]

export function Fees() {
  return (
    <section id="fees" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="section-label">Economics</p>
            <h2 className="font-display mt-4 text-4xl font-semibold lg:text-5xl">
              Your wallet,<br />
              <span className="accent-text italic">your routing</span>
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
              Genesis aggregates pump.fun creator fees across child agents. No staking,
              no lockups — you decide what gets tokenized and when.
            </p>
          </div>
          <div className="panel-elevated rounded-2xl p-7 lg:p-8">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text">Fee overview</span>
              <span className="rounded-md border border-line px-2 py-0.5 text-xs text-muted">
                Preview
              </span>
            </div>
            <div className="mt-7 space-y-5">
              {AGENTS.map((a) => (
                <div key={a.name}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-text">{a.name}</span>
                    <span className="font-mono text-sage">{a.fees} SOL</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${a.pct}%`, opacity: a.pct ? 1 : 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-end justify-between border-t border-line pt-7">
              <span className="text-sm text-muted">Total earned</span>
              <span className="font-display text-3xl font-semibold text-text">
                15.5{' '}
                <span className="text-base font-normal text-muted">SOL</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}