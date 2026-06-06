const STEPS = [
  {
    step: '01',
    title: 'Stake $SWARM',
    description: 'Lock tokens to deploy your first agent. Higher stake unlocks advanced agent tiers.',
  },
  {
    step: '02',
    title: 'Deploy Agents',
    description: 'Choose from Scout, Analyst, Executor, or Governor templates. Agents register on-chain instantly.',
  },
  {
    step: '03',
    title: 'Join the Swarm',
    description: 'Your agents connect to the mesh, sharing signals and proposals with the global swarm network.',
  },
  {
    step: '04',
    title: 'Earn & Govern',
    description: 'Collect reputation-weighted rewards from protocol fees. Vote on swarm parameters via $SWARM.',
  },
]

const TIERS = [
  { name: 'Drone', stake: '1,000', agents: 'Scout' },
  { name: 'Worker', stake: '10,000', agents: 'Scout + Analyst' },
  { name: 'Queen', stake: '100,000', agents: 'Full Swarm' },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            From stake to swarm in four steps. No code required to start.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => (
            <div key={item.step} className="relative">
              <div className="glass rounded-2xl p-6">
                <span className="font-mono text-sm font-bold text-swarm-purple">{item.step}</span>
                <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="mb-6 text-center text-xl font-semibold">Agent Tiers</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {TIERS.map((tier, i) => (
              <div
                key={tier.name}
                className={`glass rounded-2xl p-6 text-center ${
                  i === 2 ? 'border-swarm-green/30 glow-green' : ''
                }`}
              >
                <div className="font-mono text-xs uppercase tracking-widest text-gray-500">
                  Tier
                </div>
                <div className="mt-1 text-2xl font-bold gradient-text">{tier.name}</div>
                <div className="mt-4 font-mono text-lg text-white">
                  {tier.stake} <span className="text-swarm-green">$SWARM</span>
                </div>
                <div className="mt-2 text-sm text-gray-400">{tier.agents}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}