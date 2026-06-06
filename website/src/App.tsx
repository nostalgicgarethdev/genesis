import { Home } from './pages/Home'
import { Dashboard } from './pages/Dashboard'

function getView(): 'home' | 'dashboard' {
  const params = new URLSearchParams(window.location.search)
  if (params.get('view') === 'dashboard') return 'dashboard'
  if (params.get('logged_in') === '1') return 'dashboard'
  return 'home'
}

export default function App() {
  const view = getView()

  return (
    <div className="noise relative min-h-screen">
      {view === 'dashboard' ? <Dashboard /> : <Home />}
    </div>
  )
}