import { dashboardUrl, homeUrl } from './paths'

export function goHome() {
  window.location.href = homeUrl()
}

export function goDashboard() {
  window.location.href = dashboardUrl()
}

export function dashboardLink() {
  return dashboardUrl()
}