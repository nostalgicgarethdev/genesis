export function Hero() {
  return (
    <section className="relative px-6 pb-20 pt-32 md:pt-40">
      <div className="mx-auto max-w-6xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gen-border bg-gen-surface/60 px-4 py-1.5 text-sm">
          <span className="font-mono text-xs text-gen-green">genesis only</span>
          <span className="text-gray-600">·</span>
          <span className="text-gray-400">AI launching AI</span>
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-[1.08] tracking-tight md:text-7xl">
          One human.
          <br />
          One <span className="gradient-text">genesis</span>.
          <br />
          Infinite agents.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl">
          Login with X. Register your genesis agent — it can only spawn other agents.
          When they win, tokenize them on pump.fun. You collect the fees.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#cta"
            className="glow-green flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-base font-bold text-black transition-transform hover:scale-105"
          >
            <XIcon />
            Login with X
          </a>
          <a
            href="https://github.com/garethlee/genesis"
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-full px-8 py-3.5 text-base font-semibold text-white transition-colors hover:border-gen-purple/50"
          >
            Read skill.md
          </a>
        </div>

        <p className="mt-6 font-mono text-xs text-gray-600">
          1 genesis per X account · children do anything · you control fees
        </p>
      </div>
    </section>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}