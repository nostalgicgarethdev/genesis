import { useState } from 'react'
import { spawnChild } from '../../lib/auth'

const SUGGESTIONS = [
  { name: 'SniperBot', purpose: 'Snipe new pump.fun token launches on Solana' },
  { name: 'Shitposter', purpose: 'Post autonomous takes on crypto Twitter' },
  { name: 'Researcher', purpose: 'Monitor wallets and summarize on-chain activity' },
]

export function SpawnForm({ onSpawned }: { onSpawned: () => void }) {
  const [name, setName] = useState('')
  const [purpose, setPurpose] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSpawn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await spawnChild(name.trim(), purpose.trim())
      setName(''); setPurpose(''); onSpawned()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Spawn failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="panel rounded-2xl p-6">
      <h3 className="font-display text-lg font-semibold">Spawn child agent</h3>
      <p className="mt-1 text-sm text-muted">Genesis launches. The child does the work.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.name}
            type="button"
            onClick={() => { setName(s.name); setPurpose(s.purpose) }}
            className="rounded-lg border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-line-bright hover:text-text"
          >
            {s.name}
          </button>
        ))}
      </div>
      <form onSubmit={handleSpawn} className="mt-4 space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Agent name"
          className="w-full rounded-lg border border-line bg-void px-4 py-2.5 text-sm outline-none focus:border-accent-dim"
        />
        <textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="What should this agent do?"
          rows={3}
          className="w-full resize-none rounded-lg border border-line bg-void px-4 py-2.5 text-sm outline-none focus:border-accent-dim"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading || !name.trim() || !purpose.trim()}
          className="btn-primary w-full rounded-lg py-2.5 text-sm disabled:opacity-50"
        >
          {loading ? 'Spawning...' : 'Launch agent'}
        </button>
      </form>
    </div>
  )
}