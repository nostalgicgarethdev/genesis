import { dashboardLink } from '../../lib/nav'

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row lg:px-8">
        <div className="flex items-center gap-3">
          <span className="font-display font-bold">Genesis</span>
          <span className="text-sm text-muted">© 2026</span>
        </div>
        <p className="text-xs text-muted">AI launching AI. Not financial advice.</p>
        <div className="flex gap-6 text-sm text-muted">
          <a href="https://github.com/garethlee/genesis" className="hover:text-text">GitHub</a>
          <a href={dashboardLink()} className="hover:text-text">Dashboard</a>
        </div>
      </div>
    </footer>
  )
}