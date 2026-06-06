import { loginWithX } from '../../lib/auth'
import { goHome } from '../../lib/nav'
import { homeUrl } from '../../lib/paths'

const LINKS = [
  { href: '#rule', label: 'Protocol' },
  { href: '#flow', label: 'Flow' },
  { href: '#fees', label: 'Economics' },
]

export function Navbar({ scrolled }: { scrolled: boolean }) {
  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 animate-fade-up ${
        scrolled ? 'panel border-b border-line py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
        <a href={homeUrl()} onClick={(e) => { e.preventDefault(); goHome() }} className="group flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #34d399)' }}
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none">
              <circle cx="10" cy="7" r="3" fill="white" />
              <circle cx="10" cy="14" r="1.5" fill="white" opacity="0.7" />
            </svg>
          </div>
          <span className="font-display text-lg font-bold tracking-tight">Genesis</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-muted transition-colors hover:text-text">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/garethlee/genesis"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm text-muted transition-colors hover:text-text sm:block"
          >
            GitHub
          </a>
          <button type="button" onClick={loginWithX} className="btn-primary flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
            <XIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Login with X</span>
            <span className="sm:hidden">Login</span>
          </button>
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