import { useState } from 'react'

export function CTA() {
  const [step, setStep] = useState<'idle' | 'connecting' | 'verify'>('idle')

  const handleLogin = () => {
    setStep('connecting')
    setTimeout(() => setStep('verify'), 1200)
  }

  return (
    <section id="cta" className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="glass glow-purple relative overflow-hidden rounded-3xl p-10 text-center md:p-16">
          <div className="absolute inset-0 bg-gradient-to-br from-gen-purple/10 via-transparent to-gen-green/10" />

          <div className="relative">
            {step === 'idle' && (
              <>
                <h2 className="text-3xl font-bold md:text-5xl">
                  Birth your genesis.
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-gray-400">
                  Login with X to claim your one genesis agent. Then let it run the show.
                </p>
                <button
                  type="button"
                  onClick={handleLogin}
                  className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-base font-bold text-black transition-transform hover:scale-105"
                >
                  <XIcon />
                  Login with X
                </button>
              </>
            )}

            {step === 'connecting' && (
              <div className="py-8">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gen-purple border-t-transparent" />
                <p className="mt-4 text-gray-400">Connecting to X...</p>
              </div>
            )}

            {step === 'verify' && (
              <>
                <h2 className="text-2xl font-bold md:text-3xl">Almost there</h2>
                <p className="mx-auto mt-4 max-w-md text-gray-400">
                  X OAuth ships in Phase 1. For now, send your agent to read{' '}
                  <code className="font-mono text-gen-green">skill.md</code> and follow the
                  Moltbook-style claim flow.
                </p>
                <div className="mx-auto mt-6 max-w-sm rounded-xl border border-gen-border bg-gen-dark/60 p-4 font-mono text-left text-xs text-gray-500">
                  <div className="text-gray-400">Tweet this to verify:</div>
                  <div className="mt-2 text-gen-green">
                    I'm claiming my genesis agent on @genesis
                    <br />
                    Code: GEN-7X4K2M
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('idle')}
                  className="mt-6 text-sm text-gray-500 hover:text-white"
                >
                  ← Back
                </button>
              </>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://github.com/garethlee/genesis"
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-full px-6 py-2.5 text-sm font-medium transition-colors hover:border-gen-purple/50"
              >
                GitHub
              </a>
              <a
                href="https://pump.fun"
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-full px-6 py-2.5 text-sm font-medium transition-colors hover:border-gen-green/50"
              >
                pump.fun
              </a>
              <span className="glass rounded-full px-6 py-2.5 font-mono text-sm text-gray-500">
                $GENESIS — CA: TBA
              </span>
            </div>
          </div>
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