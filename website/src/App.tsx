import { useEffect } from 'react'
import { Home } from './pages/Home'
import { Dashboard } from './pages/Dashboard'
import { dashboardUrl, isDashboardPath } from './lib/paths'

function getView(): 'home' | 'dashboard' {
  const params = new URLSearchParams(window.location.search)
  if (isDashboardPath()) return 'dashboard'
  if (params.get('auth_code')) return 'dashboard'
  if (params.get('view') === 'dashboard') return 'dashboard'
  if (params.get('logged_in') === '1') return 'dashboard'
  return 'home'
}

function normalizeUrl() {
  const params = new URLSearchParams(window.location.search)
  const authCode = params.get('auth_code')
  const legacy =
    params.get('view') === 'dashboard' ||
    params.get('logged_in') === '1'

  if (authCode && !isDashboardPath()) {
    window.location.replace(`${dashboardUrl()}?auth_code=${encodeURIComponent(authCode)}`)
    return
  }

  if (!legacy || isDashboardPath()) return

  params.delete('view')
  params.delete('logged_in')
  const query = params.toString()
  const next = query ? `${dashboardUrl()}?${query}` : dashboardUrl()
  window.history.replaceState(null, '', next)
}

export default function App() {
  const view = getView()

  useEffect(() => {
    normalizeUrl()
  }, [])

  return (
    <div className="ambient-bg relative min-h-screen">
      {view === 'dashboard' ? <Dashboard /> : <Home />}
    </div>
  )
}