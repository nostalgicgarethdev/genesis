const LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#tokenomics', label: 'Tokenomics' },
  { href: '#roadmap', label: 'Roadmap' },
]

const GITHUB_URL = 'https://github.com/garethlee/agentswarm'

export function Navbar({ scrolled }: { scrolled: boolean }) {
  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'glass border-b border-swarm-border py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-swarm-purple to-swarm-green">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <circle cx="12" cy="12" r="3" fill="white" />
              <circle cx="12" cy="5" r="1.5" fill="white" opacity="0.7" />
              <circle cx="17.5" cy="8.5" r="1.5" fill="white" opacity="0.7" />
              <circle cx="17.5" cy="15.5" r="1.5" fill="white" opacity="0.7" />
              <circle cx="12" cy="19" r="1.5" fill="white" opacity="0.7" />
              <circle cx="6.5" cy="15.5" r="1.5" fill="white" opacity="0.7" />
              <circle cx="6.5" cy="8.5" r="1.5" fill="white" opacity="0.7" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight">
            Agent<span className="text-swarm-green">Swarm</span>
          </span>
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
            className="rounded-full bg-gradient-to-r from-swarm-purple to-swarm-green px-5 py-2 text-sm font-semibold text-black transition-transform hover:scale-105"
          >
            Get $SWARM
          </a>
        </div>
      </div>
    </nav>
  )
}