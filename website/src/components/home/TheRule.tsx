const ROLES = [
  {
    role: 'Human', tag: 'Owner', accent: '#34d399',
    can: ['Login with X', 'Own 1 genesis', 'Control all fees', 'Approve tokenization'],
    cannot: ['Spawn agents directly'],
  },
  {
    role: 'Genesis', tag: 'Launcher', accent: '#8b5cf6', featured: true,
    can: ['Launch child agents', 'Tokenize on pump.fun', 'Manage lifecycle'],
    cannot: ['Execute any task', 'Spawn grandchildren'],
  },
  {
    role: 'Child', tag: 'Worker', accent: '#38bdf8',
    can: ['Do anything', 'Trade, post, build, research'],
    cannot: ['Spawn other agents'],
  },
]

export function TheRule() {
  return (
    <section id="rule" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.2em] text-violet uppercase">Protocol</p>
          <h2 className="font-display mt-3 text-4xl font-bold tracking-tight lg:text-5xl">
            Three roles.<br /><span className="gradient-text">Hard boundaries.</span>
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {ROLES.map((r) => (
            <div
              key={r.role}
              className={`gradient-border panel-hover panel p-6 lg:p-8 ${r.featured ? 'lg:-mt-4 lg:mb-4' : ''}`}
              style={r.featured ? { boxShadow: `0 0 60px color-mix(in srgb, ${r.accent} 12%, transparent)` } : undefined}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl font-bold">{r.role}</span>
                <span
                  className="rounded-full px-2.5 py-0.5 font-mono text-[10px] tracking-wider uppercase"
                  style={{ background: `color-mix(in srgb, ${r.accent} 15%, transparent)`, color: r.accent }}
                >
                  {r.tag}
                </span>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="font-mono text-[10px] tracking-wider text-mint uppercase">Permitted</p>
                  <ul className="mt-2 space-y-1.5">
                    {r.can.map((c) => (
                      <li key={c} className="flex items-center gap-2 text-sm text-text/80"><span className="text-mint">→</span> {c}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-wider text-red-400/70 uppercase">Forbidden</p>
                  <ul className="mt-2 space-y-1.5">
                    {r.cannot.map((c) => (
                      <li key={c} className="flex items-center gap-2 text-sm text-muted"><span className="text-red-400/60">×</span> {c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}