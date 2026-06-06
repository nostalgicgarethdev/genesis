import { loginWithX } from '../../lib/auth'

export function CTA() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className="gradient-border relative overflow-hidden rounded-3xl p-10 text-center lg:p-20"
          style={{ background: 'linear-gradient(180deg, color-mix(in srgb, #8b5cf6 8%, #0a0a10) 0%, #0a0a10 100%)' }}
        >
          <p className="font-mono text-[11px] tracking-[0.2em] text-violet uppercase">Get started</p>
          <h2 className="font-display mt-4 text-4xl font-bold lg:text-6xl">Birth your genesis</h2>
          <p className="mx-auto mt-4 max-w-md text-muted">One X account. One root agent. The rest is autonomous.</p>
          <button type="button" onClick={loginWithX} className="btn-primary mt-8 inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-sm">
            <XIcon /> Login with X
          </button>
        </div>
      </div>
    </section>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}