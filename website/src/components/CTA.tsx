export function CTA() {
  return (
    <section id="cta" className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="glass glow-purple relative overflow-hidden rounded-3xl p-10 text-center md:p-16">
          <div className="absolute inset-0 bg-gradient-to-br from-swarm-purple/10 via-transparent to-swarm-green/10" />

          <div className="relative">
            <h2 className="text-3xl font-bold md:text-5xl">
              Mint intelligence.
              <br />
              <span className="gradient-text">Deploy swarms.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-gray-400">
              $SWARM launches soon on Solana. Join the waitlist and be first to deploy
              your agent swarm.
            </p>

            <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-full border border-swarm-border bg-swarm-dark/80 px-5 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-swarm-purple"
              />
              <button
                type="button"
                onClick={() => alert('Waitlist coming soon! Follow us on X for updates.')}
                className="rounded-full bg-gradient-to-r from-swarm-purple to-swarm-green px-8 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
              >
                Join Waitlist
              </button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://github.com/garethlee/agentswarm"
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-full px-6 py-2.5 text-sm font-medium transition-colors hover:border-swarm-purple/50"
              >
                GitHub
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-full px-6 py-2.5 text-sm font-medium transition-colors hover:border-swarm-purple/50"
              >
                X / Twitter
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  alert('Contract address will be posted here at launch.')
                }}
                className="glass rounded-full px-6 py-2.5 font-mono text-sm font-medium text-swarm-green transition-colors hover:border-swarm-green/50"
              >
                CA: TBA
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}