import { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { TheRule } from './components/TheRule'
import { HowItWorks } from './components/HowItWorks'
import { Fees } from './components/Fees'
import { Roadmap } from './components/Roadmap'
import { CTA } from './components/CTA'
import { Footer } from './components/Footer'
import { LineageTree } from './components/LineageTree'

function App() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gen-purple/8 blur-[120px]" />
        <div className="absolute top-1/2 -right-1/4 h-[500px] w-[500px] rounded-full bg-gen-green/6 blur-[100px]" />
        <LineageTree />
      </div>

      <Navbar scrolled={scrolled} />

      <main className="relative z-10">
        <Hero />
        <TheRule />
        <HowItWorks />
        <Fees />
        <Roadmap />
        <CTA />
      </main>

      <Footer />
    </div>
  )
}

export default App