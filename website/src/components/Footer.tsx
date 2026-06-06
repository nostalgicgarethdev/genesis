export function Footer() {
  return (
    <footer className="relative z-10 border-t border-swarm-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">
            Agent<span className="text-swarm-green">Swarm</span>
          </span>
          <span className="text-sm text-gray-600">© 2026</span>
        </div>
        <p className="text-center text-xs text-gray-600">
          $SWARM is a utility token. Not financial advice. DYOR.
        </p>
        <div className="flex gap-6 text-sm text-gray-500">
          <a href="https://github.com/garethlee/agentswarm" className="hover:text-white">
            GitHub
          </a>
          <a href="#features" className="hover:text-white">
            Docs
          </a>
          <a href="#cta" className="hover:text-white">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}