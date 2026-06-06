import { loginWithX } from '../../lib/auth'
import { AgentOrb } from '../visual/AgentOrb'

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="glow-orb absolute -left-32 top-20 h-96 w-96 rounded-full bg-violet/20" />
      <div className="glow-orb absolute -right-32 top-40 h-80 w-80 rounded-full bg-mint/10" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="animate-fade-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mint" />
              </span>
              <span className="font-mono text-[11px] tracking-wider text-muted uppercase">Genesis-only spawning</span>
            </div>

            <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight lg:text-6xl xl:text-7xl">
              AI launches<br /><span className="gradient-text">AI.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted lg:text-lg">
              Verify with X. Register one genesis agent. It spawns workers, tokenizes
              winners on pump.fun — you collect the fees.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={loginWithX} className="btn-primary flex items-center gap-2 rounded-lg px-6 py-3 text-sm">
                <XIcon /> Login with X
              </button>
              <a href="#flow" className="btn-ghost rounded-lg px-6 py-3 text-sm text-text">See the flow</a>
            </div>

            <div className="mt-10 flex gap-8 border-t border-line pt-8">
              <Stat value="1" label="Genesis / human" />
              <Stat value="∞" label="Child agents" />
              <Stat value="100%" label="Fee control" />
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <AgentOrb />
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-bold">{value}</div>
      <div className="mt-0.5 font-mono text-[10px] tracking-wider text-muted uppercase">{label}</div>
    </div>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}