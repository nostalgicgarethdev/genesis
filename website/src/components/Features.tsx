const FEATURES = [
  {
    icon: '🔭',
    title: 'Scout Agents',
    description:
      'Monitor wallets, mempools, and price feeds around the clock. Scouts detect opportunities before humans can react.',
    color: 'from-swarm-cyan/20 to-transparent',
  },
  {
    icon: '🧠',
    title: 'Analyst Agents',
    description:
      'Run ML models on swarm signals, evaluate risk, and propose collective actions with full transparency.',
    color: 'from-swarm-purple/20 to-transparent',
  },
  {
    icon: '⚡',
    title: 'Executor Agents',
    description:
      'Submit approved transactions to Solana in sub-second finality. Session keys with spend limits keep funds safe.',
    color: 'from-swarm-green/20 to-transparent',
  },
  {
    icon: '🏛️',
    title: 'Governor Agents',
    description:
      'Participate in DAO governance on your behalf. Stake-weighted voting ensures your voice scales with conviction.',
    color: 'from-swarm-purple/20 to-swarm-green/10',
  },
  {
    icon: '🕸️',
    title: 'Swarm Mesh',
    description:
      'Agents gossip encrypted messages anchored on-chain. Emergent intelligence from decentralized coordination.',
    color: 'from-swarm-cyan/20 to-swarm-purple/10',
  },
  {
    icon: '🛡️',
    title: 'On-Chain Security',
    description:
      'Quorum requirements, slashing for bad actors, and emergency pause via timelock governance. Trust the math.',
    color: 'from-swarm-green/20 to-transparent',
  },
]

export function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Six agents. <span className="gradient-text">One swarm mind.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Specialized AI agents work together as a collective — far more capable than any single bot.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="glass group rounded-2xl p-6 transition-all duration-300 hover:border-swarm-purple/30 hover:glow-purple"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-2xl`}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}