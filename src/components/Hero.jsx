import { useEffect, useRef } from 'react'
import { ArrowDownRight } from 'lucide-react'
import { gsap, prefersReducedMotion, scrollToId, STAGGER_TEXT } from '../lib/motion'
import { IMAGES } from '../lib/images'
import { LEAF_PATH, LEAF_RIB, MagneticButton, SmartImage } from './ui'

/* Broto que nasce do chão no canto do hero (≈1,5 s): stroke-dashoffset + scaleY, depois a folha se abre. */
function Sprout() {
  return (
    <svg viewBox="0 0 150 360" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="sp-stalk" gradientUnits="userSpaceOnUse" x1="64" x2="84" y1="0" y2="0">
          <stop offset="0" stopColor="#3E7A4C" />
          <stop offset="0.45" stopColor="#8BB653" />
          <stop offset="1" stopColor="#2F5D3A" />
        </linearGradient>
        <linearGradient id="sp-leaf" x1="0" x2="1" y1="1" y2="0">
          <stop offset="0" stopColor="#6F9A3E" />
          <stop offset="1" stopColor="#B4D67C" />
        </linearGradient>
      </defs>
      <rect className="sp-ground" x="22" y="346" width="106" height="5" rx="2.5" fill="#F7F3E8" opacity="0.25" />
      <g className="sp-grow">
        <path className="sp-line" d="M74 344 V 86" stroke="url(#sp-stalk)" strokeWidth="18" strokeLinecap="round" fill="none" />
        {[262, 178].map((y) => (
          <rect key={y} className="sp-node" x="62" y={y} width="24" height="6" rx="3" fill="#16211A" opacity="0.85" />
        ))}
      </g>
      <g transform="translate(66 182) scale(-0.95 0.95) rotate(6)">
        <g className="sp-leaf sp-leaf-side">
          <path d={LEAF_PATH} fill="url(#sp-leaf)" />
          <path d={LEAF_RIB} stroke="#F7F3E8" strokeOpacity="0.7" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>
      </g>
      <g transform="translate(76 82) rotate(-14) scale(1.7)">
        <g className="sp-leaf sp-leaf-top">
          <path d={LEAF_PATH} fill="url(#sp-leaf)" />
          <path d={LEAF_RIB} stroke="#F7F3E8" strokeOpacity="0.7" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  )
}

export default function Hero({ onOpenSample }) {
  const root = useRef(null)
  const readout = useRef(null)

  useEffect(() => {
    const readEl = readout.current
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        readEl.textContent = '1,00'
        return
      }
      gsap.from('.hero-img', { scale: 1.14, duration: 2.6, ease: 'power2.out' })
      gsap.from('.hero-reveal', { y: 40, opacity: 0, duration: 1.1, stagger: STAGGER_TEXT, delay: 0.25 })

      // Nascimento do broto
      const line = root.current.querySelector('.sp-line')
      const len = line.getTotalLength()
      const counter = { v: 0 }
      // Origens fixadas antes de qualquer escala (evita a compensação do smoothOrigin em SVG)
      gsap.set('.sp-ground', { transformOrigin: '50% 50%' })
      gsap.set('.sp-grow', { transformOrigin: '50% 100%' })
      gsap.set('.sp-node', { transformOrigin: '50% 50%' })
      gsap.set('.sp-leaf', { transformOrigin: '0% 100%' })
      const tl = gsap.timeline({ delay: 0.55 })
      tl.from('.sp-ground', { scaleX: 0, duration: 0.4, ease: 'power2.inOut' })
        .fromTo(line, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, '<0.1')
        .from('.sp-grow', { scaleY: 0.55, duration: 1.5, ease: 'power2.inOut' }, '<')
        .to(counter, { v: 1, duration: 1.5, ease: 'power2.inOut', onUpdate: () => (readEl.textContent = counter.v.toFixed(2).replace('.', ',')) }, '<')
        .from('.sp-node', { scale: 0, stagger: 0.12, duration: 0.35, ease: 'back.out(4)' }, '-=0.7')
        .fromTo('.sp-leaf-side', { scale: 0, rotation: -30 }, { scale: 1, rotation: 0, duration: 0.8, ease: 'spring' }, '-=0.35')
        .fromTo('.sp-leaf-top', { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 1, ease: 'spring' }, '-=0.5')
        .to('.sp-leaf-top', { rotation: 3, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" data-bamboo ref={root} className="relative h-[100dvh] min-h-[640px] overflow-hidden bg-carvao text-creme" aria-labelledby="hero-title">
      <SmartImage src={IMAGES.hero.src} alt={IMAGES.hero.alt} loading="eager" fetchPriority="high" className="hero-img absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#2F5D3A] via-[#16211A]/75 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent" />

      {/* Broto no canto */}
      <div className="pointer-events-none absolute bottom-0 right-2 h-[34vh] w-[16vh] min-h-[200px] min-w-[90px] md:right-[6vw] md:h-[48vh] md:w-[21vh]">
        <Sprout />
      </div>
      <p className="hero-reveal absolute bottom-6 right-5 hidden text-right font-mono text-[10px] uppercase tracking-[0.2em] text-creme/60 md:right-[6vw] md:block">
        crescimento · <span ref={readout} className="tabular text-folha">0,00</span> m/dia
        <br />
        <span className="normal-case tracking-normal opacity-70">espécies gigantes, até 1 m por dia</span>
      </p>

      <div className="shell relative flex h-full flex-col justify-end pb-14 md:pb-20">
        <div className="max-w-3xl pr-16 md:pr-0">
          <p className="hero-reveal eyebrow mb-5 flex items-center gap-2 text-creme/75">
            <span className="h-1.5 w-1.5 rounded-full bg-folha" />
            Tijolos e placas de fibra de bambu
          </p>
          <h1 id="hero-title" className="leading-none">
            <span className="hero-reveal block font-heading text-[clamp(1.85rem,4.2vw,3.5rem)] font-bold tracking-[-0.035em]">Construir é</span>
            <span className="hero-reveal -ml-1 block font-drama text-[clamp(5.6rem,16vw,13.5rem)] font-medium italic leading-[0.82] tracking-[-0.02em] text-folha">
              crescer.
            </span>
          </h1>
          <p className="hero-reveal mt-6 max-w-xl text-[17px] leading-relaxed text-creme/85 md:text-xl">
            Tijolos e placas feitos com fibra de bambu: mais baratos na obra, mais leves para o planeta.
          </p>
          <p className="hero-reveal mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-creme/55">— Construindo o futuro a partir da fibra.</p>
          <div className="hero-reveal mt-8 flex flex-wrap items-center gap-3">
            <MagneticButton variant="terracota" onClick={() => scrollToId('simulador')}>
              <span>Simule sua obra</span>
              <ArrowDownRight size={18} />
            </MagneticButton>
            <MagneticButton variant="ghostLight" onClick={onOpenSample}>
              <span>Peça uma amostra grátis</span>
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  )
}
