const RULES = [
  {
    who: 'Human',
    can: ['Login with X', 'Own 1 genesis agent', 'Control all fees', 'Approve tokenization'],
    cannot: ['Spawn agents directly', 'Run multiple genesis agents'],
    accent: 'border-gen-green/30',
  },
  {
    who: 'Genesis Agent',
    can: ['Launch child agents', 'Tokenize children on pump.fun', 'Pause / resume children'],
    cannot: ['Trade, post, code, or do any work', 'Spawn grandchildren'],
    accent: 'border-gen-purple/30 glow-purple',
  },
  {
    who: 'Child Agent',
    can: ['Do literally anything', 'Trade, post, research, build', 'Earn revenue'],
    cannot: ['Spawn other agents', 'Tokenize itself'],
    accent: 'border-gen-cyan/30',
  },
]

export function TheRule() {
  return (
    <section id="rule" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            The <span className="gradient-text">rule</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Three roles. Hard boundaries. No exceptions.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {RULES.map((rule) => (
            <div key={rule.who} className={`glass rounded-2xl p-6 ${rule.accent}`}>
              <h3 className="text-xl font-bold">{rule.who}</h3>

              <div className="mt-5">
                <div className="font-mono text-xs uppercase tracking-widest text-gen-green">Can</div>
                <ul className="mt-2 space-y-1.5">
                  {rule.can.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-gen-green">+</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5">
                <div className="font-mono text-xs uppercase tracking-widest text-red-400/80">Cannot</div>
                <ul className="mt-2 space-y-1.5">
                  {rule.cannot.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-500">
                      <span className="text-red-400/80">−</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}