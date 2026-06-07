import { useState } from 'react'
import type { ChildAgent } from '../../lib/auth'
import { pauseChild, resumeChild, tokenizeChild } from '../../lib/auth'

export function ChildCard({ child, onUpdate }: { child: ChildAgent; onUpdate: () => void }) {
  const [ticker, setTicker] = useState(child.name.slice(0, 6).toUpperCase())
  const [devBuy, setDevBuy] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const statusColor = {
    spawning: 'text-yellow-500',
    active: 'text-sage',
    paused: 'text-muted',
    tokenized: 'text-accent-bright',
  }[child.status]

  const handleTokenize = async () => {
    setLoading(true)
    setError('')
    try { await tokenizeChild(child.id, ticker, devBuy); onUpdate() }
    catch (e) { setError(e instanceof Error ? e.message : 'Failed') }
    finally { setLoading(false) }
  }

  const handleTogglePause = async () => {
    setLoading(true)
    try {
      if (child.status === 'paused') await resumeChild(child.id)
      else await pauseChild(child.id)
      onUpdate()
    } finally { setLoading(false) }
  }

  return (
    <div className="panel panel-hover rounded-xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-display font-semibold">{child.name}</h4>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{child.purpose}</p>
        </div>
        <span className={`shrink-0 text-xs font-medium uppercase tracking-wide ${statusColor}`}>
          {child.status}
        </span>
      </div>

      {child.token ? (
        <div className="mt-4 rounded-lg border border-line bg-void px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm text-sage">${child.token.ticker}</span>
            <a href={child.token.pumpFunUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">
              pump.fun →
            </a>
          </div>
        </div>
      ) : child.status !== 'paused' ? (
        <div className="mt-4 space-y-2">
          <div className="flex gap-2">
            <input
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              maxLength={10}
              placeholder="TICKER"
              className="flex-1 rounded-lg border border-line bg-void px-3 py-2 font-mono text-xs outline-none focus:border-accent-dim"
            />
            <div className="flex items-center gap-1 rounded-lg border border-line bg-void px-2 text-xs">
              <span className="text-muted">dev buy</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={devBuy}
                onChange={(e) => setDevBuy(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-16 bg-transparent font-mono text-xs outline-none"
              />
              <span className="text-muted">SOL</span>
            </div>
            <button
              type="button"
              onClick={handleTokenize}
              disabled={loading}
              className="btn-primary shrink-0 rounded-lg px-3 py-2 text-xs disabled:opacity-50"
            >
              Tokenize
            </button>
          </div>
          <p className="text-[10px] text-muted">0 = create only. Small dev buy (e.g. 0.05) helps initial momentum. Uses your linked launch wallet.</p>
        </div>
      ) : null}

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <span className="font-mono text-xs text-muted">{child.feesEarned.toFixed(1)} SOL earned</span>
        {child.status !== 'tokenized' && (
          <button type="button" onClick={handleTogglePause} disabled={loading} className="text-xs text-muted hover:text-text">
            {child.status === 'paused' ? 'Resume' : 'Pause'}
          </button>
        )}
      </div>
    </div>
  )
}