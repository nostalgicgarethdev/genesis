const PHASES = [
  {
    phase: 'Phase 1',
    title: 'Genesis',
    date: 'Q2 2026',
    status: 'current' as const,
    items: ['X OAuth login', '1 genesis per X account', 'Tweet verification', '$GENESIS token launch'],
  },
  {
    phase: 'Phase 2',
    title: 'Spawn',
    date: 'Q3 2026',
    status: 'upcoming' as const,
    items: ['Genesis runtime (launch-only)', 'Child agent containers', 'Agent tree dashboard'],
  },
  {
    phase: 'Phase 3',
    title: 'Tokenize',
    date: 'Q4 2026',
    status: 'upcoming' as const,
    items: ['pump.fun integration', 'Creator fee tracking', 'Reinvest rules'],
  },
  {
    phase: 'Phase 4',
    title: 'Economy',
    date: '2027',
    status: 'upcoming' as const,
    items: ['Agent leaderboards', 'Public agent browser', 'Mobile app'],
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
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PHASES.map((phase) => (
            <div
              key={phase.phase}
              className={`glass rounded-2xl p-6 ${
                phase.status === 'current' ? 'border-gen-green/40 glow-green' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-gray-500">{phase.phase}</span>
                {phase.status === 'current' && (
                  <span className="rounded-full bg-gen-green/20 px-2 py-0.5 text-xs font-semibold text-gen-green">
                    Now
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-lg font-bold">{phase.title}</h3>
              <p className="font-mono text-sm text-gen-purple">{phase.date}</p>
              <ul className="mt-4 space-y-2">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gen-purple" />
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