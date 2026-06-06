import type { ChildAgent } from '../../lib/auth'

export function LineageView({ genesisName, children }: { genesisName: string; children: ChildAgent[] }) {
  return (
    <div className="panel rounded-xl p-6">
      <h3 className="font-display font-bold">Lineage</h3>
      <p className="mt-1 text-sm text-muted">{children.length} child agent{children.length !== 1 ? 's' : ''}</p>
      <div className="relative mt-8 flex flex-col items-center">
        <div className="z-10 flex h-14 w-14 items-center justify-center rounded-xl font-mono text-xs font-medium animate-pulse-soft"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #5b21b6)', boxShadow: '0 0 30px rgba(139,92,246,0.3)' }}>
          GEN
        </div>
        <p className="mt-2 font-mono text-[10px] text-muted">{genesisName}</p>
        <div className="mt-10 grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => (
            <div key={child.id} className="rounded-lg border border-line bg-void px-3 py-2.5 text-center">
              <div className="mx-auto mb-1.5 h-2 w-2 rounded-full"
                style={{ background: child.token ? '#8b5cf6' : child.status === 'active' ? '#34d399' : '#8888a8' }} />
              <p className="text-xs font-medium">{child.name}</p>
              {child.token && <p className="font-mono text-[10px] text-violet">${child.token.ticker}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}