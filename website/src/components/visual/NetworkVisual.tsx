const NODES = [
  { x: 200, y: 88, label: 'Trader', tone: 'bright' as const },
  { x: 312, y: 148, label: 'Research', tone: 'dim' as const },
  { x: 288, y: 268, label: 'Poster', tone: 'muted' as const },
  { x: 112, y: 268, label: 'Coder', tone: 'dim' as const },
  { x: 88, y: 148, label: 'Scout', tone: 'bright' as const },
]

const toneFill = {
  bright: 'var(--color-accent-bright)',
  dim: 'var(--color-accent)',
  muted: 'var(--color-muted)',
}

export function NetworkVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="panel-elevated overflow-hidden rounded-2xl p-6 lg:p-8">
        <div className="mb-4 flex items-center justify-between">
          <span className="section-label">Live topology</span>
          <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">
            1 genesis · 5 workers
          </span>
        </div>
        <svg viewBox="0 0 400 340" className="w-full" aria-hidden>
          <defs>
            <linearGradient id="link" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c4a574" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#7d9a82" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          {NODES.map((node) => (
            <line
              key={node.label}
              x1="200"
              y1="178"
              x2={node.x}
              y2={node.y}
              stroke="url(#link)"
              strokeWidth="1"
            />
          ))}
          <circle cx="200" cy="178" r="28" fill="#18181b" stroke="#c4a574" strokeWidth="1.5" />
          <circle cx="200" cy="178" r="6" fill="#c4a574" />
          <text x="200" y="230" textAnchor="middle" fill="#a1a1aa" fontSize="11" fontFamily="Source Sans 3, sans-serif">
            Genesis
          </text>
          {NODES.map((node) => (
            <g key={node.label}>
              <circle cx={node.x} cy={node.y} r="18" fill="#111113" stroke="#3f3f46" strokeWidth="1" />
              <circle cx={node.x} cy={node.y} r="4" fill={toneFill[node.tone]} />
              <text
                x={node.x}
                y={node.y + 34}
                textAnchor="middle"
                fill="#a1a1aa"
                fontSize="10"
                fontFamily="Source Sans 3, sans-serif"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}