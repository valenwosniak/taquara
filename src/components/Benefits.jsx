import { useEffect, useRef, useState } from 'react'
import { CalendarCheck, Coins, Leaf } from 'lucide-react'
import { gsap, prefersReducedMotion, STAGGER_CARDS, STAGGER_TEXT } from '../lib/motion'
import { Estimate } from './ui'

/* ───────────── 1. Diagnostic Shuffler ───────────── */
const SHUFFLE = [
  { k: 'co2', tag: 'captura', value: '17 t', label: '17 t de CO₂ por hectare ao ano', est: true },
  { k: 'forno', tag: 'processo', value: '0 °C', label: 'Sem forno, sem queima' },
  { k: 'ciclo', tag: 'ciclo', value: '3–5 anos', label: 'Matéria-prima renovável em 3 a 5 anos' },
]

function DiagnosticShuffler() {
  const [items, setItems] = useState(SHUFFLE)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const id = setInterval(() => {
      setItems((prev) => {
        const next = [...prev]
        next.unshift(next.pop())
        return next
      })
      setTick((t) => t + 1)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative h-60 rounded-[1.75rem] bg-taquara/[0.06] p-4">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-taquara/70">
        <span>diagnóstico · carbono</span>
        <span className="tabular">ciclo 0{(tick % 3) + 1}/03</span>
      </div>
      <div className="mt-2 h-[2px] overflow-hidden rounded-full bg-taquara/10">
        <div key={tick} className="h-full origin-left bg-folha motion-safe:animate-[grow_3s_linear_forwards]" />
      </div>
      <div className="absolute inset-x-4 bottom-4 h-[138px]">
        {items.map((it, pos) => (
          <div
            key={it.k}
            className="absolute inset-x-0 bottom-0 rounded-[1.5rem] border border-carvao/10 bg-creme p-4 shadow-card transition-[transform,opacity] duration-700 ease-spring"
            style={{
              transform: `translateY(${-pos * 16}px) scale(${1 - pos * 0.06})`,
              opacity: 1 - pos * 0.3,
              zIndex: 10 - pos,
            }}
            aria-hidden={pos !== 0}
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-folha/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-taquara">{it.tag}</span>
              <span className="font-drama text-3xl italic text-terracota">{it.value}</span>
            </div>
            <p className="mt-3 font-heading text-lg font-semibold leading-tight text-carvao">
              {it.label} {it.est && <Estimate />}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ───────────── 2. Telemetry Typewriter ───────────── */
const FEED = [
  '> parede de 40 m² analisada',
  '> tijolos de encaixe: 2.560 un.',
  '> juntas de argamassa: mínimas',
  '> reboco: dispensável',
  '> economia estimada: 20% a 40%',
]

function TelemetryTypewriter() {
  const [done, setDone] = useState(() => (prefersReducedMotion() ? FEED : []))
  const [current, setCurrent] = useState('')

  useEffect(() => {
    if (prefersReducedMotion()) return
    let line = 0
    let char = 0
    let t
    const step = () => {
      const text = FEED[line]
      if (char <= text.length) {
        setCurrent(text.slice(0, char))
        char += 1
        t = setTimeout(step, 34 + Math.random() * 40)
      } else {
        setDone((d) => [...d, text].slice(-5))
        setCurrent('')
        line += 1
        char = 0
        if (line >= FEED.length) {
          t = setTimeout(() => {
            setDone([])
            line = 0
            step()
          }, 2600)
        } else {
          t = setTimeout(step, 520)
        }
      }
    }
    t = setTimeout(step, 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="h-60 rounded-[1.75rem] bg-carvao p-4 text-creme" role="log" aria-live="off">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
        <span className="flex items-center gap-2 text-folha">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-folha text-folha" />
          Live Feed
        </span>
        <span className="text-creme/40">obra · 40 m²</span>
      </div>
      <div className="mt-4 space-y-1.5 font-mono text-[12.5px] leading-relaxed">
        {done.map((l, i) => (
          <p key={`${l}-${i}`} className={l.includes('economia') ? 'text-argila' : 'text-creme/70'}>
            {l}
            {l.includes('economia') && <span className="ml-1 text-[10px] text-creme/50">(estimativa)</span>}
          </p>
        ))}
        {done.length < FEED.length && (
          <p className="text-creme">
            {current}
            <span className="caret ml-0.5 inline-block h-[14px] w-[7px] translate-y-[2px] bg-terracota" />
          </p>
        )}
      </div>
    </div>
  )
}

/* ───────────── 3. Cursor Scheduler ───────────── */
const DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const TARGET_DAY = 4

function CursorScheduler() {
  const root = useRef(null)

  useEffect(() => {
    const el = root.current
    if (prefersReducedMotion()) {
      gsap.set(el.querySelector(`[data-day="${TARGET_DAY}"]`), { backgroundColor: '#C9622F', color: '#F7F3E8' })
      gsap.set(el.querySelector('.sch-msg'), { opacity: 1 })
      return
    }
    const ctx = gsap.context(() => {
      const cursor = el.querySelector('.sch-cursor')
      const day = el.querySelector(`[data-day="${TARGET_DAY}"]`)
      const btn = el.querySelector('.sch-btn')
      const msg = el.querySelector('.sch-msg')
      const center = (node) => ({
        x: () => node.offsetLeft + node.offsetWidth / 2 - 4,
        y: () => node.offsetTop + node.offsetHeight / 2 - 2,
      })

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, defaults: { ease: 'power2.inOut' } })
      tl.set(cursor, { x: () => el.offsetWidth + 10, y: () => el.offsetHeight - 10, opacity: 0, scale: 1 })
        .set(day, { backgroundColor: 'rgba(47,93,58,0.06)', color: '#16211A', scale: 1 })
        .set(msg, { opacity: 0, y: 6 })
        .to(cursor, { opacity: 1, duration: 0.3 })
        .to(cursor, { ...center(day), duration: 1.1 }, '<')
        .to([cursor, day], { scale: 0.95, duration: 0.12, ease: 'power2.out' })
        .to([cursor, day], { scale: 1, duration: 0.18, ease: 'power2.out' })
        .to(day, { backgroundColor: '#C9622F', color: '#F7F3E8', duration: 0.3 }, '<')
        .to(cursor, { ...center(btn), duration: 0.9 }, '+=0.35')
        .to([cursor, btn], { scale: 0.95, duration: 0.12, ease: 'power2.out' })
        .to([cursor, btn], { scale: 1, duration: 0.18, ease: 'power2.out' })
        .to(msg, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '<')
        .to(cursor, { opacity: 0, x: '+=24', y: '+=24', duration: 0.5 }, '+=1.4')
        .to(msg, { opacity: 0, duration: 0.4 }, '+=0.6')
        .to(day, { backgroundColor: 'rgba(47,93,58,0.06)', color: '#16211A', duration: 0.4 }, '<')

      const onResize = () => tl.invalidate()
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="relative h-60 overflow-hidden rounded-[1.75rem] bg-taquara/[0.06] p-4">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-taquara/70">
        <span>cronograma · parede A</span>
        <span>sem. 14</span>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {DAYS.map((d, i) => (
          <div key={i} data-day={i} className="flex aspect-square flex-col items-center justify-center rounded-2xl bg-taquara/[0.06] font-mono text-[11px] font-medium text-carvao">
            <span>{d}</span>
            <span className="text-[9px] opacity-50">{10 + i}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-taquara/10">
        <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-taquara to-folha" />
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-carvao/50">
        <span>fiadas 14/20</span>
        <span>prazo: sáb.</span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span className="sch-btn inline-flex rounded-full bg-taquara px-4 py-2 font-heading text-[12px] font-semibold text-creme">Salvar cronograma</span>
      </div>
      <p className="sch-msg mt-2 font-heading text-[13px] font-semibold text-terracota opacity-0">
        Parede pronta antes do prazo <Estimate />
      </p>

      <svg className="sch-cursor pointer-events-none absolute left-0 top-0 z-10 h-6 w-6 opacity-0 drop-shadow-md" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 2.5 L19 13 L12.2 14.2 L15.6 21 L12.6 22.3 L9.3 15.6 L4 20 Z" fill="#16211A" stroke="#F7F3E8" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/* ───────────── Seção ───────────── */
const CARDS = [
  {
    icon: Leaf,
    code: 'ART-01',
    title: 'Captura de carbono',
    desc: 'A fibra vem de um bambuzal que absorve CO₂ enquanto cresce. O tijolo é curado, não queimado.',
    Artifact: DiagnosticShuffler,
  },
  {
    icon: Coins,
    code: 'ART-02',
    title: 'Economia na obra',
    desc: 'Encaixe modular, juntas mínimas e quase nada de reboco: menos material e menos mão de obra na parede.',
    Artifact: TelemetryTypewriter,
  },
  {
    icon: CalendarCheck,
    code: 'ART-03',
    title: 'Obra mais rápida',
    desc: 'Tijolos que se encaixam e placas leves sobem em menos dias. O cronograma agradece.',
    Artifact: CursorScheduler,
  },
]

export default function Benefits() {
  const root = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.ben-head > *', { y: 40, opacity: 0, stagger: STAGGER_TEXT, scrollTrigger: { trigger: '.ben-head', start: 'top 80%' } })
      gsap.from('.ben-card', { y: 60, opacity: 0, duration: 1.1, stagger: STAGGER_CARDS, scrollTrigger: { trigger: '.ben-grid', start: 'top 80%' } })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="beneficios" data-bamboo ref={root} className="relative py-24 md:py-36" aria-labelledby="ben-title">
      <div className="shell">
        <div className="ben-head max-w-3xl">
          <p className="eyebrow text-terracota">01 · Benefícios</p>
          <h2 id="ben-title" className="mt-4 text-[clamp(2.2rem,5vw,4rem)] leading-[1.02] tracking-[-0.04em] text-taquara">
            Bambu vira fibra. Fibra vira <span className="font-drama font-medium italic text-terracota">parede</span>.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-carvao/70">
            A Taquara não faz móveis nem estruturas de bambu inteiro. O bambu é matéria-prima: vira fibra tratada, que vira o{' '}
            <strong className="font-semibold text-carvao">Tijolo Taquara</strong> (solo-cimento reforçado com fibra) e a{' '}
            <strong className="font-semibold text-carvao">Placa Taquara</strong> (forros e paredes internas).
          </p>
        </div>

        <div className="ben-grid mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CARDS.map(({ icon: Icon, code, title, desc, Artifact }) => (
            <article key={code} className="ben-card instrument flex flex-col p-5 md:p-6">
              <Artifact />
              <div className="mt-6 flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-taquara text-creme">
                  <Icon size={18} />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-carvao/40">{code}</span>
              </div>
              <h3 className="mt-4 text-2xl tracking-[-0.03em] text-carvao">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-carvao/65">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
