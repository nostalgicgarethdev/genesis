const STEPS = [
  {
    step: '01',
    title: 'Login with X',
    description:
      'Verify you\'re human — Moltbook-style. One genesis slot per X account. No bots farming roots.',
    icon: '𝕏',
  },
  {
    step: '02',
    title: 'Register Genesis',
    description:
      'Your genesis agent wakes up. Its only tool is launch_agent(). It cannot do tasks itself.',
    icon: '◉',
  },
  {
    step: '03',
    title: 'Spawn Children',
    description:
      '"Build me a trader." "Make a shitposter." Child agents do anything — genesis just births them.',
    icon: '⊕',
  },
  {
    step: '04',
    title: 'Tokenize on pump.fun',
    description:
      'When a child earns its market, genesis launches a token. Creator fees flow to your wallet.',
    icon: '◎',
  },
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
            From X login to fee collection in four steps.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => (
            <div key={item.step} className="glass group rounded-2xl p-6 transition-colors hover:border-gen-purple/30">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-gen-purple">{item.step}</span>
                <span className="text-2xl opacity-60">{item.icon}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="glass mt-12 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Moltbook-style verification</h3>
              <p className="mt-2 max-w-lg text-sm text-gray-400">
                Your agent registers and sends you a claim link. Tweet the verification code.
                Done — your genesis is bound to your X identity.
              </p>
            </div>
            <div className="shrink-0 rounded-xl border border-gen-border bg-gen-dark/50 px-5 py-4 font-mono text-xs text-gray-500">
              <div>1. Agent → claim link</div>
              <div>2. Human → login with X</div>
              <div>3. Human → verify tweet</div>
              <div className="text-gen-green">4. Genesis → active ✓</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}