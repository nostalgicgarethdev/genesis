/** Vite base URL — `/` locally, `/genesis/` on GitHub Pages */
export const BASE = import.meta.env.BASE_URL

export function homeUrl(): string {
  return BASE
}

export function dashboardUrl(): string {
  return `${BASE}?view=dashboard`
}

export function loggedInUrl(): string {
  return `${BASE}?logged_in=1`
}

export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${BASE.replace(/\/$/, '')}${p}`
}