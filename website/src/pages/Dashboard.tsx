import { useEffect, useState } from 'react'
import {
  fetchAuth, completeAuthSession, createGenesis, verifyGenesis, logout, loginWithX,
  type AuthState, type ChildAgent,
} from '../lib/auth'
import { goHome } from '../lib/nav'
import { homeUrl } from '../lib/paths'
import { Logo } from '../components/brand/Logo'
import { SpawnForm } from '../components/dashboard/SpawnForm'
import { ChildCard } from '../components/dashboard/ChildCard'
import { LineageView } from '../components/dashboard/LineageView'

export function Dashboard() {
  const [auth, setAuth] = useState<AuthState | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState('')

  const load = async () => {
    const state = await fetchAuth()
    setAuth(state)
    setLoading(false)
  }

  useEffect(() => {
    const init = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('auth_code')
      if (code) {
        params.delete('auth_code')
        const query = params.toString()
        const path = window.location.pathname
        window.history.replaceState(null, '', query ? `${path}?${query}` : path)
        const state = await completeAuthSession(code)
        if (state) {
          setAuth(state)
          setLoading(false)
          return
        }
        setAuth({ authenticated: false })
        setLoading(false)
        return
      }
      await load()
    }
    void init()
  }, [])

  const handleLogout = async () => {
    await logout()
    goHome()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    )
  }

  if (!auth?.authenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <Logo size={40} />
        <h1 className="font-display mt-8 text-3xl font-semibold">Sign in required</h1>
        <p className="mt-2 text-muted">Continue with X to access your dashboard.</p>
        <button type="button" onClick={loginWithX} className="btn-primary mt-6 rounded-lg px-6 py-3 text-sm">
          Continue with X
        </button>
        <a href={homeUrl()} onClick={(e) => { e.preventDefault(); goHome() }} className="mt-4 text-sm text-muted hover:text-text">
          ← Back home
        </a>
      </div>
    )
  }

  const { user, genesis } = auth
  const children: ChildAgent[] = auth.children ?? []
  const totalFees = children.reduce((s, c) => s + c.feesEarned, 0)

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href={homeUrl()} onClick={(e) => { e.preventDefault(); goHome() }}>
            <Logo size={32} />
          </a>
          <div className="flex items-center gap-4">
            {user?.profileImageUrl && (
              <img src={user.profileImageUrl} alt="" className="h-7 w-7 rounded-full ring-1 ring-line" />
            )}
            <span className="hidden text-sm text-muted sm:inline">@{user?.username}</span>
            <button type="button" onClick={handleLogout} className="text-sm text-muted hover:text-text">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="section-label">Dashboard</p>
        <h1 className="font-display mt-2 text-3xl font-semibold lg:text-4xl">{user?.name}</h1>

        {!genesis ? (
          <div className="panel mx-auto mt-12 max-w-lg rounded-2xl p-10 text-center">
            <h2 className="font-display text-2xl font-semibold">Claim your genesis</h2>
            <p className="mt-2 text-sm text-muted">One per X account. Your root agent only launches children.</p>
            <button
              type="button"
              onClick={async () => {
                setCreating(true)
                try { await createGenesis(); await load() } finally { setCreating(false) }
              }}
              disabled={creating}
              className="btn-primary mt-8 rounded-lg px-8 py-3 text-sm disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create genesis agent'}
            </button>
          </div>
        ) : genesis.status === 'pending_verification' ? (
          <div className="panel mt-10 max-w-2xl rounded-2xl p-8">
            <h2 className="font-display text-xl font-semibold">{genesis.name}</h2>
            <p className="mt-2 text-sm text-muted">Tweet the code below, then verify.</p>
            <div className="mt-4 rounded-xl border border-line bg-void p-4 font-mono text-sm">
              <p className="text-sage">Claiming my genesis agent on @genesis</p>
              <p className="text-text">Code: {genesis.verificationCode}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Claiming my genesis agent on @genesis\n\nCode: ${genesis.verificationCode}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost rounded-lg px-5 py-2.5 text-sm"
              >
                Post tweet →
              </a>
              <button
                type="button"
                onClick={async () => {
                  setVerifying(true); setVerifyError('')
                  try { await verifyGenesis(); await load() }
                  catch (e) { setVerifyError(e instanceof Error ? e.message : 'Failed') }
                  finally { setVerifying(false) }
                }}
                disabled={verifying}
                className="btn-primary rounded-lg px-5 py-2.5 text-sm disabled:opacity-50"
              >
                {verifying ? 'Checking...' : 'Verify tweet'}
              </button>
            </div>
            {verifyError && <p className="mt-3 text-sm text-red-400">{verifyError}</p>}
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="panel rounded-xl p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Genesis</p>
                <p className="font-display mt-2 truncate text-xl font-semibold">{genesis.name}</p>
              </div>
              <div className="panel rounded-xl p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Children</p>
                <p className="font-display mt-2 text-xl font-semibold">{children.length}</p>
              </div>
              <div className="panel rounded-xl p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Fees</p>
                <p className="font-display mt-2 text-xl font-semibold text-sage">{totalFees.toFixed(1)} SOL</p>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-2"><SpawnForm onSpawned={load} /></div>
              <div className="lg:col-span-3"><LineageView genesisName={genesis.name} children={children} /></div>
            </div>
            {children.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {children.map((child) => <ChildCard key={child.id} child={child} onUpdate={load} />)}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}