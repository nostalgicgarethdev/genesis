const NODES = 6
const RADIUS = 140

export function SwarmVisualization() {
  return (
    <svg
      className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 opacity-[0.15]"
      width="400"
      height="400"
      viewBox="0 0 400 400"
    >
      <circle cx="200" cy="200" r="8" fill="#9945FF" className="animate-pulse-glow" />
      {Array.from({ length: NODES }).map((_, i) => {
        const angle = (i / NODES) * Math.PI * 2 - Math.PI / 2
        const x = 200 + Math.cos(angle) * RADIUS
        const y = 200 + Math.sin(angle) * RADIUS
        const colors = ['#14F195', '#00D4FF', '#9945FF']
        const color = colors[i % colors.length]
        return (
          <g key={i}>
            <line x1="200" y1="200" x2={x} y2={y} stroke="#9945FF" strokeWidth="0.5" opacity="0.4" />
            <circle cx={x} cy={y} r="5" fill={color} className="animate-float" style={{ animationDelay: `${i * 0.5}s` }} />
          </g>
        )
      })}
      {Array.from({ length: NODES }).map((_, i) => {
        const nextI = (i + 2) % NODES
        const angle1 = (i / NODES) * Math.PI * 2 - Math.PI / 2
        const angle2 = (nextI / NODES) * Math.PI * 2 - Math.PI / 2
        const x1 = 200 + Math.cos(angle1) * RADIUS
        const y1 = 200 + Math.sin(angle1) * RADIUS
        const x2 = 200 + Math.cos(angle2) * RADIUS
        const y2 = 200 + Math.sin(angle2) * RADIUS
        return (
          <line
            key={`cross-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#14F195"
            strokeWidth="0.3"
            opacity="0.2"
          />
        )
      })}
    </svg>
  )
}