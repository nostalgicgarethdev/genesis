import { useEffect, useState } from 'react'
import { fetchAuth } from '../lib/auth'
import { dashboardUrl } from '../lib/paths'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Hero } from '../components/home/Hero'
import { Marquee } from '../components/home/Marquee'
import { TheRule } from '../components/home/TheRule'
import { HowItWorks } from '../components/home/HowItWorks'
import { Fees } from '../components/home/Fees'
import { CTA } from '../components/home/CTA'

const AUTH_ERRORS: Record<string, string> = {
  invalid_state: 'Login session expired. Try again.',
  token_exchange: 'X login failed at token exchange. Check OAuth credentials.',
  user_fetch: 'Could not load your X profile after login.',
}

export function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    void fetchAuth().then((state) => {
      if (state.authenticated && state.user?.id !== 'dev_user_1') {
        window.location.replace(dashboardUrl())
      }
    })
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('auth') === 'error') {
      const reason = params.get('reason') ?? 'unknown'
      setAuthError(AUTH_ERRORS[reason] ?? 'Login failed. Try again.')
      params.delete('auth')
      params.delete('reason')
      const query = params.toString()
      const next = query ? `${window.location.pathname}?${query}` : window.location.pathname
      window.history.replaceState(null, '', next)
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <Navbar scrolled={scrolled} />
      {authError && (
        <div className="relative z-20 border-b border-line bg-surface px-6 py-3 text-center text-sm text-muted">
          {authError}
        </div>
      )}
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <TheRule />
        <HowItWorks />
        <Fees />
        <CTA />
      </main>
      <Footer />
    </>
  )
}