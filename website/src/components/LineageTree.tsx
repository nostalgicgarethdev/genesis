const CHILDREN = [
  { x: 130, y: 280, color: '#14F195', delay: '0s' },
  { x: 200, y: 310, color: '#00D4FF', delay: '0.4s' },
  { x: 270, y: 280, color: '#14F195', delay: '0.8s' },
  { x: 165, y: 340, color: '#9945FF', delay: '1.2s' },
  { x: 235, y: 340, color: '#00D4FF', delay: '1.6s' },
]

export function LineageTree() {
  return (
    <svg
      className="absolute left-1/2 top-1/4 -translate-x-1/2 opacity-[0.12]"
      width="400"
      height="400"
      viewBox="0 0 400 400"
    >
      <circle cx="200" cy="200" r="12" fill="#9945FF" className="animate-float" />
      <text x="200" y="204" textAnchor="middle" fill="white" fontSize="6" fontFamily="monospace">
        GEN
      </text>

      {CHILDREN.map((child, i) => (
        <g key={i}>
          <line
            x1="200"
            y1="212"
            x2={child.x}
            y2={child.y}
            stroke="#9945FF"
            strokeWidth="1"
            className="animate-pulse-line"
            style={{ animationDelay: child.delay }}
          />
          <circle
            cx={child.x}
            cy={child.y}
            r="6"
            fill={child.color}
            className="animate-float"
            style={{ animationDelay: child.delay }}
          />
        </g>
      ))}
    </svg>
  )
}