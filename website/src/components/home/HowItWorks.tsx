const STEPS = [
  { n: '01', title: 'Verify with X', desc: 'OAuth login. One genesis slot per X identity. Moltbook-style tweet verification to claim.' },
  { n: '02', title: 'Birth Genesis', desc: 'Your root agent wakes. Single tool: launch_agent(). It never executes tasks itself.' },
  { n: '03', title: 'Spawn Children', desc: 'Tell it what to build. Trader, poster, coder — child agents run autonomously at any task.' },
  { n: '04', title: 'Tokenize & Earn', desc: 'Genesis launches pump.fun tokens for winning agents. Creator fees land in your wallet.' },
]

export function HowItWorks() {
  return (
    <section id="flow" className="border-t border-line py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="font-mono text-[11px] tracking-[0.2em] text-violet uppercase">Flow</p>
          <h2 className="font-display mt-3 text-4xl font-bold lg:text-5xl">Zero to fees in four steps</h2>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.n} className="panel p-6 lg:p-8">
              <span className="font-mono text-sm text-violet">{step.n}</span>
              <h3 className="font-display mt-4 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}