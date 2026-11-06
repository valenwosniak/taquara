import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, prefersReducedMotion, scrollToId, STAGGER_TEXT } from '../lib/motion'
import { LEAF_PATH, MagneticButton } from './ui'

export default function CallToAction({ onOpenSample }) {
  const root = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.cta-reveal', { y: 40, opacity: 0, stagger: STAGGER_TEXT, scrollTrigger: { trigger: root.current, start: 'top 65%' } })
      gsap.to('.cta-ring', { rotation: (i) => (i % 2 ? -360 : 360), svgOrigin: '300 300', duration: (i) => 60 + i * 20, ease: 'none', repeat: -1 })
      gsap.set('.cta-leaf', { transformOrigin: '0% 100%' })
      gsap.fromTo('.cta-leaf', { scale: 0.6, rotation: -20 }, { scale: 1, rotation: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'center center', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="comece" data-bamboo ref={root} className="relative mx-2 overflow-hidden rounded-5xl bg-taquara text-creme md:mx-4" aria-labelledby="cta-title">
      <svg viewBox="0 0 600 600" className="pointer-events-none absolute -right-48 -top-40 h-[760px] w-[760px] opacity-[0.16]" aria-hidden="true">
        {[280, 230, 180, 130].map((r, i) => (
          <circle key={r} className="cta-ring" cx="300" cy="300" r={r} fill="none" stroke="#F7F3E8" strokeWidth={i % 2 ? 1 : 10} strokeDasharray={i % 2 ? '2 10' : '90 24'} strokeLinecap="round" />
        ))}
      </svg>
      <svg viewBox="-10 -60 70 70" className="pointer-events-none absolute -bottom-6 right-6 h-60 w-60 opacity-25 md:right-24 md:h-96 md:w-96" aria-hidden="true">
        <path className="cta-leaf" d={LEAF_PATH} fill="#8BB653" />
      </svg>

      <div className="shell relative py-28 md:py-44">
        <p className="cta-reveal eyebrow text-folha">06 · Comece agora</p>
        <h2 id="cta-title" className="cta-reveal mt-6 max-w-4xl text-[clamp(2.6rem,7vw,6.2rem)] leading-[0.95] tracking-[-0.045em]">
          Sua próxima obra
          <br />
          pode <span className="font-drama font-medium italic text-folha">crescer.</span>
        </h2>
        <p className="cta-reveal mt-6 max-w-xl text-lg leading-relaxed text-creme/75">
          Faça a simulação em menos de um minuto ou receba em casa uma amostra do Tijolo e da Placa Taquara. Sem custo, sem compromisso.
        </p>
        <div className="cta-reveal mt-10 flex flex-wrap gap-3">
          <MagneticButton variant="terracota" onClick={() => scrollToId('simulador')}>
            <span>Simule sua obra</span>
            <ArrowUpRight size={18} />
          </MagneticButton>
          <MagneticButton variant="ghostLight" onClick={onOpenSample}>
            <span>Peça uma amostra grátis</span>
          </MagneticButton>
        </div>
        <dl className="cta-reveal mt-16 grid max-w-2xl grid-cols-3 gap-4 border-t border-creme/15 pt-6 font-mono">
          {[
            ['20–40%', 'economia na parede (estimativa)'],
            ['0', 'fornos'],
            ['17 t', 'CO₂/ha/ano no bambuzal (estimativa)'],
          ].map(([v, l]) => (
            <div key={l}>
              <dt className="sr-only">{l}</dt>
              <dd className="text-[clamp(1.2rem,2.4vw,1.8rem)] font-medium text-creme">{v}</dd>
              <dd className="mt-1 text-[10.5px] leading-snug text-creme/55">{l}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
