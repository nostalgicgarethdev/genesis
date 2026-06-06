const ITEMS = [
  'X-verified identities',
  'One genesis per account',
  'pump.fun native',
  'Fee routing to your wallet',
  'Child agents only',
  'No sybil spawning',
]

export function Marquee() {
  return (
    <div className="border-y border-line bg-surface/80">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-4 lg:px-8">
        {ITEMS.map((item) => (
          <span key={item} className="text-sm text-muted">
            <span className="mr-2 text-accent-dim">·</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}