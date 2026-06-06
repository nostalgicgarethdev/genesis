type LogoProps = {
  size?: number
  showWordmark?: boolean
  className?: string
}

export function Logo({ size = 36, showWordmark = true, className = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <rect width="40" height="40" rx="11" className="fill-surface-2" />
        <circle cx="20" cy="21" r="3.5" className="fill-accent" />
        <path
          d="M20 17.5C20 11 14 8.5 11.5 13"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="text-accent"
        />
        <path
          d="M20 17.5C20 11 26 8.5 28.5 13"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="text-accent-bright"
        />
        <path
          d="M20 24.5V31"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="text-accent-dim"
          opacity="0.65"
        />
        <circle cx="11.5" cy="13" r="2" className="fill-accent-dim" opacity="0.85" />
        <circle cx="28.5" cy="13" r="2" className="fill-accent-bright" opacity="0.85" />
        <circle cx="20" cy="31" r="1.75" className="fill-muted" opacity="0.5" />
      </svg>
      {showWordmark && (
        <span className="font-display text-lg font-semibold tracking-tight text-text">
          Genesis
        </span>
      )}
    </span>
  )
}