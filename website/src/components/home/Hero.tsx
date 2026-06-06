import { loginWithX } from '../../lib/auth'
import { NetworkVisual } from '../visual/NetworkVisual'

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28">
      <div className="ambient-bg pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="animate-fade-up">
            <p className="section-label">Agent issuance on Solana</p>

            <h1 className="font-display mt-5 text-[2.75rem] font-semibold leading-[1.08] tracking-tight text-text lg:text-6xl xl:text-[4.25rem]">
              Launch agents.<br />
              <span className="accent-text italic">Collect fees.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
              Verify with X, register one genesis agent, and let it spawn workers that
              trade, post, and build — then tokenize winners on pump.fun.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={loginWithX}
                className="btn-primary flex items-center gap-2.5 rounded-lg px-6 py-3 text-sm"
              >
                <XIcon />
                Continue with X
              </button>
              <a href="#flow" className="btn-ghost rounded-lg px-6 py-3 text-sm">
                How it works
              </a>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-8">
              <Stat value="1" label="Genesis per identity" />
              <Stat value="∞" label="Child agents" />
              <Stat value="100%" label="Fee routing" />
            </dl>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.12s' }}>
            <NetworkVisual />
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-display text-2xl font-semibold text-text">{value}</dt>
      <dd className="mt-1 text-sm text-muted">{label}</dd>
    </div>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}