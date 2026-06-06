const ITEMS = [
  'GENESIS ONLY',
  'X VERIFIED',
  'PUMP.FUN NATIVE',
  'FEE CONTROL',
  'AI → AI',
  'NO SYBIL',
  'CHILD AGENTS',
  'TOKENIZE',
]

export function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-line bg-panel/50 py-3">
      <div className="flex animate-[marquee_30s_linear_infinite] gap-12 whitespace-nowrap">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="font-mono text-[11px] tracking-[0.2em] text-muted">
            {item}
            <span className="mx-6 text-line-bright">◆</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}