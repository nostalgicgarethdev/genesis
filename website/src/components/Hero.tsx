const STATS = [
  { value: '1B', label: 'Total Supply' },
  { value: '4', label: 'Agent Types' },
  { value: '<400ms', label: 'Solana Finality' },
  { value: '24/7', label: 'Autonomous' },
]

export function Hero() {
  return (
    <section className="relative px-6 pb-20 pt-32 md:pt-40">
      <div className="mx-auto max-w-6xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-swarm-border bg-swarm-surface/60 px-4 py-1.5 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-swarm-green opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-swarm-green" />
          </span>
          <span className="text-gray-400">Built on</span>
          <span className="font-semibold text-swarm-green">Solana</span>
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight md:text-7xl">
          Autonomous AI{' '}
          <span className="gradient-text">Agent Swarms</span>
          <br />
          on Solana
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl">
          Deploy intelligent agent networks that coordinate, vote, and execute on-chain —
          powered by the <span className="font-mono font-semibold text-swarm-green">$SWARM</span> token.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#cta"
            className="glow-green rounded-full bg-gradient-to-r from-swarm-green to-swarm-cyan px-8 py-3.5 text-base font-bold text-black transition-transform hover:scale-105"
          >
            Launch App — Coming Soon
          </a>
          <a
            href="https://github.com/garethlee/agentswarm"
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-full px-8 py-3.5 text-base font-semibold text-white transition-colors hover:border-swarm-purple/50"
          >
            View on GitHub
          </a>
        </div>

        <div className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-5">
              <div className="font-mono text-2xl font-bold text-white md:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}