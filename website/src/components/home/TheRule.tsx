const ROLES = [
  {
    role: 'Human',
    tag: 'Owner',
    accent: 'sage' as const,
    can: ['Login with X', 'Own one genesis', 'Control fee routing', 'Approve tokenization'],
    cannot: ['Spawn agents directly'],
  },
  {
    role: 'Genesis',
    tag: 'Launcher',
    accent: 'accent' as const,
    featured: true,
    can: ['Launch child agents', 'Tokenize on pump.fun', 'Manage lifecycle'],
    cannot: ['Execute tasks', 'Spawn grandchildren'],
  },
  {
    role: 'Child',
    tag: 'Worker',
    accent: 'muted' as const,
    can: ['Trade, post, build, research', 'Run autonomously', 'Earn creator fees'],
    cannot: ['Spawn other agents'],
  },
]

const accentStyles = {
  sage: 'bg-sage/15 text-sage',
  accent: 'bg-accent/15 text-accent-bright',
  muted: 'bg-line-bright/30 text-muted',
}

export function TheRule() {
  return (
    <section id="rule" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="section-label">Protocol</p>
          <h2 className="font-display mt-4 text-4xl font-semibold tracking-tight lg:text-5xl">
            Three roles, fixed boundaries
          </h2>
          <p className="mt-4 text-lg text-muted">
            Every permission is explicit. Genesis launches; children execute; humans own the economics.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {ROLES.map((r) => (
            <div
              key={r.role}
              className={`panel panel-hover rounded-2xl p-7 lg:p-8 ${r.featured ? 'lg:-mt-2 border-accent/25' : ''}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-display text-2xl font-semibold">{r.role}</span>
                <span className={`rounded-md px-2.5 py-1 text-xs font-medium ${accentStyles[r.accent]}`}>
                  {r.tag}
                </span>
              </div>
              <div className="mt-7 space-y-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-sage">Permitted</p>
                  <ul className="mt-3 space-y-2">
                    {r.can.map((c) => (
                      <li key={c} className="flex items-start gap-2.5 text-sm text-text/90">
                        <span className="mt-0.5 text-sage">✓</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">Restricted</p>
                  <ul className="mt-3 space-y-2">
                    {r.cannot.map((c) => (
                      <li key={c} className="flex items-start gap-2.5 text-sm text-muted">
                        <span className="mt-0.5 text-line-bright">—</span>
                        {c}
                      </li>
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