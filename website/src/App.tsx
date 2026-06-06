import { useEffect, useState } from 'react'
import { SwarmVisualization } from './components/SwarmVisualization'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Features } from './components/Features'
import { HowItWorks } from './components/HowItWorks'
import { Tokenomics } from './components/Tokenomics'
import { Roadmap } from './components/Roadmap'
import { CTA } from './components/CTA'
import { Footer } from './components/Footer'

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
        <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-swarm-purple/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-1/4 h-[600px] w-[600px] rounded-full bg-swarm-green/8 blur-[100px]" />
        <div className="absolute bottom-0 -left-1/4 h-[500px] w-[500px] rounded-full bg-swarm-cyan/8 blur-[100px]" />
        <SwarmVisualization />
      </div>

      <Navbar scrolled={scrolled} />

      <main className="relative z-10">
        <Hero />
        <Features />
        <HowItWorks />
        <Tokenomics />
        <Roadmap />
        <CTA />
      </main>

      <Footer />
    </div>
  )
}

export default App