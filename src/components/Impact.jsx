import { useEffect, useRef } from 'react'
import { Check, Flame, X } from 'lucide-react'
import { gsap, prefersReducedMotion, STAGGER_CARDS } from '../lib/motion'
import { IMAGES } from '../lib/images'
import { Estimate, SmartImage } from './ui'

const INDICATORS = [
  { value: 'até 1 m', label: 'de crescimento por dia', note: 'espécies gigantes de bambu' },
  { value: '800–1.000 kg', label: 'de CO₂ por tonelada de concreto', note: 'emitidos na produção' },
  { value: '0', label: 'fornos no nosso processo', note: 'curado, nunca queimado' },
]

// Comparação: barras são índices relativos (tijolo comum = 100)
const ROWS = [
  { k: 'Queima', common: { text: 'Queimado em forno', bad: true }, taquara: { text: 'Curado, sem forno' } },
  { k: 'Argamassa', common: { text: 'Juntas espessas em todas as fiadas', bad: true }, taquara: { text: 'Juntas mínimas, por encaixe' } },
  { k: 'Reboco', common: { text: 'Necessário nas duas faces', bad: true }, taquara: { text: 'Quase dispensável' } },
  { k: 'Tempo de obra', common: { bar: 100, text: 'Referência' }, taquara: { bar: 65, text: 'Menos dias de obra', est: true } },
  { k: 'Custo da parede', common: { bar: 100, text: 'Referência' }, taquara: { bar: 70, text: '20% a 40% menor', est: true } },
  { k: 'Emissões', common: { bar: 100, text: 'Queima + mais insumos' }, taquara: { bar: 40, text: 'Sem queima; fibra que capturou CO₂', est: true } },
]

function Cell({ data, taquara }) {
  return (
    <div className="flex min-w-0 flex-col justify-center gap-2">
      <p className={`flex items-start gap-2 text-[14.5px] leading-snug ${taquara ? 'font-semibold text-carvao' : 'text-carvao/60'}`}>
        {data.bar == null &&
          (data.bad ? (
            <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-terracota/15 text-terracota">
              {data.text.includes('forno') ? <Flame size={10} /> : <X size={10} strokeWidth={3} />}
            </span>
          ) : (
            <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-folha/25 text-taquara">
              <Check size={10} strokeWidth={3} />
            </span>
          ))}
        <span>
          {data.text} {data.est && <Estimate />}
        </span>
      </p>
      {data.bar != null && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-carvao/[0.07]">
          <div
            className={`cmp-bar h-full rounded-full ${taquara ? 'bg-gradient-to-r from-taquara to-folha' : 'bg-carvao/35'}`}
            style={{ width: `${data.bar}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default function Impact() {
  const root = useRef(null)
  const num = useRef(null)

  useEffect(() => {
    const ticks = gsap.utils.toArray('.imp-tick', root.current)
    const numEl = num.current
    if (prefersReducedMotion()) {
      numEl.textContent = '17'
      ticks.forEach((t) => t.classList.add('bg-folha'))
      return
    }
    const ctx = gsap.context(() => {
      const counter = { v: 0 }
      gsap.to(counter, {
        v: 17,
        duration: 2.4,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.imp-num', start: 'top 80%', toggleActions: 'play none none reverse' },
        onUpdate: () => {
          const v = Math.round(counter.v)
          numEl.textContent = String(v)
          ticks.forEach((t, i) => t.classList.toggle('bg-folha', i < v))
        },
      })
      gsap.from('.imp-copy > *', { y: 40, opacity: 0, stagger: 0.08, scrollTrigger: { trigger: '.imp-num', start: 'top 70%' } })
      gsap.from('.imp-ind', { y: 50, opacity: 0, stagger: STAGGER_CARDS, scrollTrigger: { trigger: '.imp-inds', start: 'top 85%' } })
      gsap.from('.cmp-row', { y: 24, opacity: 0, stagger: 0.08, scrollTrigger: { trigger: '.cmp', start: 'top 75%' } })
      gsap.from('.cmp-bar', { width: 0, duration: 1.4, ease: 'power2.inOut', stagger: 0.06, scrollTrigger: { trigger: '.cmp', start: 'top 60%' } })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="impacto" data-bamboo ref={root} className="relative overflow-hidden py-24 md:py-36" aria-labelledby="imp-title">
      <div className="shell">
        <p className="eyebrow text-terracota">03 · Impacto</p>

        <div className="mt-4 grid items-end gap-6 lg:grid-cols-[auto,1fr] lg:gap-12">
          <div className="imp-num relative select-none pr-[0.6em] font-drama text-[clamp(11rem,38vw,30rem)] font-medium italic leading-[0.78] tracking-[-0.04em] text-taquara" aria-hidden="true">
            {/* "17" invisível reserva a largura final; o contador fica por cima */}
            <span className="invisible block">17</span>
            <span ref={num} className="absolute left-0 top-0 block">
              0
            </span>
            <span className="absolute right-0 top-[10%] font-heading text-[0.085em] font-bold not-italic tracking-normal text-terracota">t CO₂</span>
          </div>
          <div className="imp-copy pb-4 lg:pb-10">
            <h2 id="imp-title" className="max-w-xl text-[clamp(1.6rem,3.2vw,2.75rem)] leading-[1.08] tracking-[-0.035em] text-carvao">
              <span className="sr-only">17 </span>toneladas de CO₂ capturadas por hectare de bambu, todo ano.
            </h2>
            <p className="mt-3 font-mono text-[11px] text-carvao/50">
              até 17 t · CO₂/ha/ano <Estimate />
            </p>
            <div className="mt-6 flex max-w-md gap-1" aria-hidden="true">
              {Array.from({ length: 17 }, (_, i) => (
                <span key={i} className="imp-tick h-6 flex-1 rounded-full bg-carvao/10 transition-colors duration-200" />
              ))}
            </div>
            <div className="mt-1.5 flex max-w-md justify-between font-mono text-[10px] text-carvao/40">
              <span>0</span>
              <span>17 t</span>
            </div>
          </div>
        </div>

        <div className="imp-inds mt-16 grid gap-4 md:grid-cols-3">
          {INDICATORS.map((it) => (
            <div key={it.label} className="imp-ind instrument p-6">
              <p className="font-mono text-[clamp(1.6rem,2.6vw,2.1rem)] font-medium leading-none tracking-[-0.03em] text-taquara">{it.value}</p>
              <p className="mt-3 font-mono text-[13px] text-carvao/80">{it.label}</p>
              <p className="mt-4 border-t border-carvao/10 pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-carvao/45">{it.note}</p>
            </div>
          ))}
        </div>

        {/* Comparação */}
        <div className="cmp mt-20 grid gap-5 lg:grid-cols-[0.8fr,1.6fr]">
          <div className="relative min-h-[260px] overflow-hidden rounded-5xl">
            <SmartImage src={IMAGES.bricks.src} alt={IMAGES.bricks.alt} className="absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-carvao/85 via-carvao/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7 text-creme">
              <p className="eyebrow text-folha">comparativo</p>
              <h3 className="mt-2 text-3xl leading-tight tracking-[-0.03em]">
                Tijolo comum <span className="font-drama font-medium italic text-creme/60">vs</span> Tijolo Taquara
              </h3>
            </div>
          </div>

          <div className="instrument overflow-hidden p-2 md:p-3">
            <div className="hidden grid-cols-[150px,1fr,1fr] gap-6 px-5 pb-3 pt-4 font-mono text-[10px] uppercase tracking-[0.18em] md:grid">
              <span className="text-carvao/40">critério</span>
              <span className="text-carvao/50">tijolo comum</span>
              <span className="text-taquara">tijolo taquara</span>
            </div>
            {ROWS.map((r) => (
              <div key={r.k} className="cmp-row grid grid-cols-2 gap-x-5 gap-y-3 rounded-[1.5rem] px-5 py-4 odd:bg-taquara/[0.04] md:grid-cols-[150px,1fr,1fr] md:gap-6">
                <p className="col-span-2 font-heading text-[15px] font-semibold text-carvao md:col-span-1 md:self-center">{r.k}</p>
                <div>
                  <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.16em] text-carvao/40 md:hidden">comum</span>
                  <Cell data={r.common} />
                </div>
                <div>
                  <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.16em] text-taquara md:hidden">taquara</span>
                  <Cell data={r.taquara} taquara />
                </div>
              </div>
            ))}
            <p className="px-5 pb-3 pt-2 font-mono text-[10px] text-carvao/45">Barras: índice relativo, tijolo comum = 100 (estimativa).</p>
          </div>
        </div>
      </div>
    </section>
  )
}
