const DISTRIBUTION = [
  { label: 'Public Launch', pct: 40, color: 'bg-swarm-green' },
  { label: 'Ecosystem & Rewards', pct: 25, color: 'bg-swarm-cyan' },
  { label: 'Development', pct: 15, color: 'bg-swarm-purple' },
  { label: 'Community & Airdrops', pct: 10, color: 'bg-white/60' },
  { label: 'Treasury', pct: 10, color: 'bg-gray-500' },
]

const UTILITY = [
  'Stake to deploy AI agents',
  'Governance voting on protocol params',
  'Fee capture from agent-executed volume',
  'Deflationary burn from slashed stake',
]

export function Tokenomics() {
  return (
    <section id="tokenomics" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            <span className="font-mono text-swarm-green">$SWARM</span>{' '}
            <span className="gradient-text">Tokenomics</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            1 billion supply. Real utility. Deflationary mechanics.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="glass rounded-2xl p-8">
            <h3 className="text-lg font-semibold">Distribution</h3>
            <div className="mt-6 flex h-4 overflow-hidden rounded-full">
              {DISTRIBUTION.map((item) => (
                <div
                  key={item.label}
                  className={`${item.color} transition-all`}
                  style={{ width: `${item.pct}%` }}
                />
              ))}
            </div>
            <div className="mt-6 space-y-3">
              {DISTRIBUTION.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span className="text-gray-300">{item.label}</span>
                  </div>
                  <span className="font-mono font-semibold text-white">{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-8">
            <h3 className="text-lg font-semibold">Utility</h3>
            <ul className="mt-6 space-y-4">
              {UTILITY.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-swarm-green/20 text-xs text-swarm-green">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-swarm-border bg-swarm-dark/50 p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="font-mono text-xs text-gray-500">Chain</div>
                  <div className="mt-1 font-semibold text-swarm-green">Solana</div>
                </div>
                <div>
                  <div className="font-mono text-xs text-gray-500">Supply</div>
                  <div className="mt-1 font-semibold">1,000,000,000</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}