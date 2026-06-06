const LINKS = [
  { href: '#rule', label: 'The Rule' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#fees', label: 'Fees' },
  { href: '#roadmap', label: 'Roadmap' },
]

const GITHUB_URL = 'https://github.com/garethlee/genesis'

export function Navbar({ scrolled }: { scrolled: boolean }) {
  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'glass border-b border-gen-border py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-gen-purple to-gen-green">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <circle cx="12" cy="8" r="4" fill="white" />
              <circle cx="7" cy="17" r="2.5" fill="white" opacity="0.7" />
              <circle cx="12" cy="19" r="2" fill="white" opacity="0.6" />
              <circle cx="17" cy="17" r="2.5" fill="white" opacity="0.7" />
              <line x1="12" y1="12" x2="7" y2="14.5" stroke="white" strokeWidth="0.8" opacity="0.4" />
              <line x1="12" y1="12" x2="12" y2="17" stroke="white" strokeWidth="0.8" opacity="0.4" />
              <line x1="12" y1="12" x2="17" y2="14.5" stroke="white" strokeWidth="0.8" opacity="0.4" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight">Genesis</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm text-gray-400 transition-colors hover:text-white sm:block"
          >
            GitHub
          </a>
          <a
            href="#cta"
            className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-transform hover:scale-105"
          >
            <XIcon className="h-3.5 w-3.5" />
            Login with X
          </a>
        </div>
      </div>
    </nav>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}