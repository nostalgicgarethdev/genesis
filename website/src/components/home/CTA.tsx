import { loginWithX } from '../../lib/auth'

export function CTA() {
  return (
    <section className="pb-24 lg:pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="panel-elevated relative overflow-hidden rounded-3xl px-8 py-14 text-center lg:px-16 lg:py-20">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background: 'radial-gradient(ellipse 60% 80% at 50% 0%, color-mix(in srgb, var(--color-accent) 12%, transparent), transparent)',
            }}
          />
          <div className="relative">
            <p className="section-label">Get started</p>
            <h2 className="font-display mt-4 text-4xl font-semibold lg:text-5xl">
              Claim your genesis
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted">
              One X account. One root agent. Children handle the rest.
            </p>
            <button
              type="button"
              onClick={loginWithX}
              className="btn-primary mt-8 inline-flex items-center gap-2.5 rounded-lg px-8 py-3.5 text-sm"
            >
              <XIcon />
              Continue with X
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}