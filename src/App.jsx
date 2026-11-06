import { useCallback, useEffect, useState } from 'react'
import { ScrollTrigger } from './lib/motion'
import BambooProgress from './components/BambooProgress'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Benefits from './components/Benefits'
import Manifesto from './components/Manifesto'
import Impact from './components/Impact'
import HowItWorks from './components/HowItWorks'
import Simulator from './components/Simulator'
import CallToAction from './components/CallToAction'
import Footer from './components/Footer'
import SampleModal from './components/SampleModal'

// Um segmento do bambu por seção marcada com [data-bamboo]:
// Hero, Benefícios, Manifesto, Impacto, Como funciona, Simulador, CTA
const BAMBOO_SEGMENTS = 7

function NoiseOverlay() {
  return (
    <svg className="noise-overlay h-full w-full" aria-hidden="true">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  )
}

export default function App() {
  const [sampleOpen, setSampleOpen] = useState(false)
  const openSample = useCallback(() => setSampleOpen(true), [])
  const closeSample = useCallback(() => setSampleOpen(false), [])

  // Recalcula as posições dos ScrollTriggers quando fontes e imagens terminam de carregar
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <>
      <a href="#conteudo" className="sr-only z-[100] rounded-full bg-terracota px-4 py-2 text-creme focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Pular para o conteúdo
      </a>
      <NoiseOverlay />
      <Navbar />
      <main id="conteudo">
        <Hero onOpenSample={openSample} />
        <Benefits />
        <Manifesto />
        <Impact />
        <HowItWorks />
        <Simulator />
        <div className="py-6 md:py-10">
          <CallToAction onOpenSample={openSample} />
        </div>
      </main>
      <Footer onOpenSample={openSample} />
      <BambooProgress count={BAMBOO_SEGMENTS} />
      <SampleModal open={sampleOpen} onClose={closeSample} />
    </>
  )
}
