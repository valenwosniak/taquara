import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion, STAGGER_TEXT } from '../lib/motion'
import { IMAGES } from '../lib/images'
import { SmartImage } from './ui'

const Words = ({ text, className = '', wordClass = '' }) =>
  text.split(' ').map((w, i) => (
    <span key={i} className={`inline-block overflow-hidden pb-[0.08em] align-bottom ${className}`}>
      <span className={`mw inline-block ${wordClass}`}>{w}</span>
      {' '}
    </span>
  ))

export default function Manifesto() {
  const root = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.mf-bg', { yPercent: -12 }, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.from('.mf-a .mw', { yPercent: 110, opacity: 0, duration: 0.9, stagger: STAGGER_TEXT, scrollTrigger: { trigger: '.mf-a', start: 'top 78%' } })
      gsap.fromTo(
        '.mf-b .mw',
        { yPercent: 105, opacity: 0, rotate: 2 },
        { yPercent: 0, opacity: 1, rotate: 0, ease: 'power3.out', stagger: STAGGER_TEXT * 2, scrollTrigger: { trigger: '.mf-b', start: 'top 85%', end: 'top 40%', scrub: true } },
      )
      gsap.from('.mf-line', { scaleX: 0, transformOrigin: '0% 50%', ease: 'power2.inOut', duration: 1.4, scrollTrigger: { trigger: '.mf-b', start: 'top 70%' } })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="manifesto" data-bamboo ref={root} className="relative mx-2 overflow-hidden rounded-5xl bg-carvao text-creme md:mx-4" aria-label="Manifesto">
      <div className="absolute inset-0">
        <SmartImage src={IMAGES.manifesto.src} alt="" className="mf-bg absolute inset-x-0 -inset-y-[15%] opacity-[0.14] mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-b from-carvao via-carvao/40 to-carvao" />
      </div>

      <div className="shell relative py-32 md:py-48">
        <p className="eyebrow mb-10 text-folha/80">02 · Manifesto</p>
        <p className="mf-a max-w-3xl font-heading text-[clamp(1.25rem,2.4vw,1.9rem)] font-medium leading-snug text-creme/55">
          <Words text="A maioria da construção civil foca em:" />
          <Words text="queimar, emitir e descartar." wordClass="text-argila/90" />
        </p>

        <div className="mf-line my-12 h-px w-full max-w-4xl bg-gradient-to-r from-folha/70 via-creme/20 to-transparent md:my-16" />

        <p className="mf-b font-drama text-[clamp(3.2rem,9.5vw,9rem)] font-medium italic leading-[0.92] tracking-[-0.02em]">
          <Words text="Nós focamos em:" className="font-heading text-[0.42em] font-bold not-italic tracking-[-0.04em]" />
          <br />
          <Words text="fazer" />
          <Words text="crescer." wordClass="text-folha" />
        </p>
      </div>
    </section>
  )
}
