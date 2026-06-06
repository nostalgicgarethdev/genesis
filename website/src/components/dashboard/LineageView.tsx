import type { ChildAgent } from '../../lib/auth'

export function LineageView({ genesisName, children }: { genesisName: string; children: ChildAgent[] }) {
  return (
    <div className="panel rounded-2xl p-6">
      <h3 className="font-display font-semibold">Lineage</h3>
      <p className="mt-1 text-sm text-muted">
        {children.length} child agent{children.length !== 1 ? 's' : ''}
      </p>
      <div className="relative mt-8 flex flex-col items-center">
        <div className="z-10 flex h-14 w-14 items-center justify-center rounded-xl border border-accent/30 bg-surface-2">
          <div className="h-3 w-3 rounded-full bg-accent" />
        </div>
        <p className="mt-2 text-xs text-muted">{genesisName}</p>
        <div className="mt-10 grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => (
            <div key={child.id} className="rounded-lg border border-line bg-void px-3 py-2.5 text-center">
              <div
                className="mx-auto mb-1.5 h-2 w-2 rounded-full"
                style={{
                  background: child.token
                    ? 'var(--color-accent)'
                    : child.status === 'active'
                      ? 'var(--color-sage)'
                      : 'var(--color-muted)',
                }}
              />
              <p className="text-xs font-medium">{child.name}</p>
              {child.token && <p className="font-mono text-[10px] text-accent-dim">${child.token.ticker}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}