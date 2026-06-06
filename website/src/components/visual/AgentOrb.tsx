const CHILDREN = [
  { angle: -90, dist: 130, color: '#34d399', label: 'Trader' },
  { angle: -30, dist: 145, color: '#38bdf8', label: 'Poster' },
  { angle: 30, dist: 135, color: '#a78bfa', label: 'Scout' },
  { angle: 90, dist: 140, color: '#34d399', label: 'Coder' },
  { angle: 150, dist: 125, color: '#38bdf8', label: 'Research' },
  { angle: 210, dist: 138, color: '#a78bfa', label: 'Sniper' },
]

export function AgentOrb() {
  return (
    <div className="relative mx-auto h-[420px] w-[420px] max-w-full">
      {[160, 220, 280].map((size, i) => (
        <div
          key={size}
          className="absolute left-1/2 top-1/2 rounded-full border border-line/40 animate-spin-slow"
          style={{
            width: size,
            height: size,
            marginLeft: -size / 2,
            marginTop: -size / 2,
            animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
            animationDuration: `${40 + i * 10}s`,
          }}
        />
      ))}

      <div
        className="absolute left-1/2 top-1/2 z-10 -ml-10 -mt-10 flex h-20 w-20 items-center justify-center rounded-2xl animate-pulse-soft"
        style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #5b21b6 100%)',
          boxShadow: '0 0 60px rgba(139,92,246,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}
      >
        <span className="font-mono text-xs font-medium text-white/90">GEN</span>
      </div>

      {CHILDREN.map((child, i) => {
        const rad = (child.angle * Math.PI) / 180
        const x = Math.cos(rad) * child.dist
        const y = Math.sin(rad) * child.dist
        return (
          <div
            key={child.label}
            className="absolute left-1/2 top-1/2 z-10 animate-float"
            style={{ marginLeft: x - 28, marginTop: y - 14, animationDelay: `${i * 0.4}s` }}
          >
            <div className="panel flex items-center gap-2 rounded-full px-3 py-1.5">
              <div className="h-2 w-2 rounded-full" style={{ background: child.color, boxShadow: `0 0 8px ${child.color}` }} />
              <span className="font-mono text-[10px] text-muted">{child.label}</span>
            </div>
          </div>
        )
      })}

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 420 420">
        {CHILDREN.map((child) => {
          const rad = (child.angle * Math.PI) / 180
          const x2 = 210 + Math.cos(rad) * child.dist
          const y2 = 210 + Math.sin(rad) * child.dist
          return (
            <line key={child.label} x1="210" y1="210" x2={x2} y2={y2} stroke="url(#lineGrad)" strokeWidth="1" opacity="0.35" />
          )
        })}
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}