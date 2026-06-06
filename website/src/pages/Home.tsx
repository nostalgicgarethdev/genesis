import { useEffect, useState } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Hero } from '../components/home/Hero'
import { Marquee } from '../components/home/Marquee'
import { TheRule } from '../components/home/TheRule'
import { HowItWorks } from '../components/home/HowItWorks'
import { Fees } from '../components/home/Fees'
import { CTA } from '../components/home/CTA'

export function Home() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('auth') === 'error') {
      console.error('Auth error:', params.get('reason'))
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