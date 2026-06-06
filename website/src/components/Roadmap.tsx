const PHASES = [
  {
    phase: 'Phase 1',
    title: 'Genesis',
    date: 'Q2 2026',
    status: 'current' as const,
    items: ['Token launch on Solana', 'Landing website', 'SDK skeleton', 'Community launch'],
  },
  {
    phase: 'Phase 2',
    title: 'Registry',
    date: 'Q3 2026',
    status: 'upcoming' as const,
    items: ['Agent Registry program', 'Staking & reputation', 'Testnet deployment'],
  },
  {
    phase: 'Phase 3',
    title: 'First Swarm',
    date: 'Q4 2026',
    status: 'upcoming' as const,
    items: ['Scout & Analyst templates', 'Swarm mesh alpha', 'Live portfolio demo'],
  },
  {
    phase: 'Phase 4',
    title: 'Autonomy',
    date: '2027',
    status: 'upcoming' as const,
    items: ['Agent marketplace', 'Full DAO handover', 'Security audit'],
  },
]

export function Roadmap() {
  return (
    <section id="roadmap" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            <span className="gradient-text">Roadmap</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            From token launch to fully autonomous agent swarms.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PHASES.map((phase) => (
            <div
              key={phase.phase}
              className={`glass rounded-2xl p-6 ${
                phase.status === 'current' ? 'border-swarm-green/40 glow-green' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-gray-500">{phase.phase}</span>
                {phase.status === 'current' && (
                  <span className="rounded-full bg-swarm-green/20 px-2 py-0.5 text-xs font-semibold text-swarm-green">
                    Now
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-lg font-bold">{phase.title}</h3>
              <p className="font-mono text-sm text-swarm-purple">{phase.date}</p>
              <ul className="mt-4 space-y-2">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-swarm-purple" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}