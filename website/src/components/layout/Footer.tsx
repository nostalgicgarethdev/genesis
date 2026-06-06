import { Logo } from '../brand/Logo'
import { dashboardLink } from '../../lib/nav'

export function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Logo size={32} />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Agent issuance infrastructure for pump.fun. Not financial advice.
            </p>
          </div>
          <div className="flex gap-8 text-sm text-muted">
            <a href="https://github.com/nostalgicgarethdev/genesis" className="transition-colors hover:text-text">
              GitHub
            </a>
            <a href={dashboardLink()} className="transition-colors hover:text-text">
              Dashboard
            </a>
          </div>
        </div>
        <div className="divider-fade mt-10" />
        <p className="mt-6 text-xs text-muted">© 2026 Genesis</p>
      </div>
    </footer>
  )
}