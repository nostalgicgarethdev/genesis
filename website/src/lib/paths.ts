/** Vite base — `/` locally, `/genesis/` on GitHub Pages */
export const BASE = import.meta.env.BASE_URL

const basePath = BASE === '/' ? '' : BASE.replace(/\/$/, '')

export function stripBase(pathname: string): string {
  if (basePath && pathname.startsWith(basePath)) {
    const rest = pathname.slice(basePath.length)
    return rest.startsWith('/') ? rest : `/${rest}`
  }
  return pathname
}

export function isDashboardPath(pathname?: string): boolean {
  const relative = stripBase(pathname ?? window.location.pathname)
  return relative === '/dashboard' || relative === 'dashboard'
}

function joinBase(...segments: string[]): string {
  const tail = segments
    .map((s) => s.replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/')
  if (!basePath) return `/${tail}`
  return `${basePath}/${tail}`
}

export function homeUrl(): string {
  return BASE
}

export function dashboardUrl(): string {
  return joinBase('dashboard')
}

/** @deprecated use dashboardUrl — kept for OAuth query redirects */
export function loggedInUrl(): string {
  return dashboardUrl()
}

export function apiBase(): string {
  const origin = import.meta.env.VITE_API_URL?.replace(/\/$/, '')
  return origin ? `${origin}/api` : '/api'
}

export function apiPath(route: string): string {
  const path = route.startsWith('/') ? route : `/${route}`
  return `${apiBase()}${path}`
}

export function siteOrigin(): string {
  const configured = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '')
  if (configured) return configured
  return `${window.location.origin}${basePath}`
}