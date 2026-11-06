import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { IMAGES } from '../lib/images'
import { SmartImage } from './ui'

/* ───────── Animações SVG (cada uma roda dentro do gsap.context da seção) ───────── */

function Rings() {
  const rings = [
    { r: 128, w: 2, dash: '2 10', c: '#2F5D3A' },
    { r: 108, w: 10, dash: '60 14', c: '#8BB653' },
    { r: 86, w: 2, dash: '1 7', c: '#2F5D3A' },
    { r: 66, w: 14, dash: '120 30', c: '#2F5D3A' },
  ]
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full" aria-hidden="true">
      <circle cx="150" cy="150" r="140" fill="rgba(47,93,58,0.06)" />
      {rings.map((r, i) => (
        <circle key={i} className="ring" data-dir={i % 2 ? -1 : 1} cx="150" cy="150" r={r.r} fill="none" stroke={r.c} strokeWidth={r.w} strokeDasharray={r.dash} strokeLinecap="round" />
      ))}
      {Array.from({ length: 18 }, (_, i) => {
        const a = (i / 18) * Math.PI * 2
        return <circle key={i} className="ring-dot" cx={150 + Math.cos(a) * 97} cy={150 + Math.sin(a) * 97} r="3.2" fill="#C9622F" />
      })}
      <circle cx="150" cy="150" r="42" fill="#F7F3E8" stroke="#2F5D3A" strokeWidth="2" />
      <text x="150" y="146" textAnchor="middle" className="fill-taquara font-mono text-[11px]">colmo</text>
      <text x="150" y="162" textAnchor="middle" className="fill-carvao/50 font-mono text-[9px]">corte</text>
    </svg>
  )
}

function LaserScan() {
  const cols = 13
  const rows = 8
  return (
    <svg viewBox="0 0 300 220" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="laser" x1="0" x2="1">
          <stop offset="0" stopColor="#C9622F" stopOpacity="0" />
          <stop offset="0.5" stopColor="#E0893F" />
          <stop offset="1" stopColor="#C9622F" stopOpacity="0" />
        </linearGradient>
      </defs>
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => <circle key={`${r}-${c}`} className="scan-dot" data-row={r} cx={18 + c * 22} cy={24 + r * 25} r="2" fill="#F7F3E8" opacity="0.25" />),
      )}
      {[40, 78, 112, 150, 186].map((y, i) => (
        <path
          key={y}
          className="fiber"
          d={`M10 ${y} C 70 ${y - 18 + i * 3}, 120 ${y + 20}, 170 ${y - 4} S 260 ${y - 14}, 292 ${y + 6}`}
          fill="none"
          stroke="#8BB653"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      ))}
      <g className="laser">
        <rect x="0" y="-9" width="300" height="18" rx="9" fill="url(#laser)" opacity="0.25" />
        <rect x="0" y="-1" width="300" height="2" rx="1" fill="url(#laser)" />
      </g>
    </svg>
  )
}

function Waveform() {
  const d = 'M0 110 H70 L82 110 L92 70 L104 158 L118 30 L132 140 L142 110 H186 L196 92 L208 126 L218 110 H300'
  return (
    <svg viewBox="0 0 300 220" className="h-full w-full" aria-hidden="true">
      {Array.from({ length: 7 }, (_, i) => (
        <line key={i} x1="0" x2="300" y1={20 + i * 30} y2={20 + i * 30} stroke="#F7F3E8" strokeOpacity="0.08" />
      ))}
      <path d={d} fill="none" stroke="#F7F3E8" strokeOpacity="0.12" strokeWidth="3" strokeLinejoin="round" />
      <path className="wave" d={d} fill="none" stroke="#8BB653" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />
      <text x="8" y="208" className="fill-creme/50 font-mono text-[10px]">
        cura · temperatura ambiente · 0 queima
      </text>
    </svg>
  )
}

function BrickStack() {
  // Assentamento em amarração: fiadas pares com 3 tijolos, ímpares com 2 deslocados
  const bricks = []
  for (let row = 0; row < 4; row++) {
    const xs = row % 2 ? [66, 154] : [22, 110, 198]
    xs.forEach((x) => bricks.push({ x, y: 176 - row * 42 }))
  }
  return (
    <svg viewBox="0 0 300 230" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="brick" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#E0893F" />
          <stop offset="1" stopColor="#C9622F" />
        </linearGradient>
      </defs>
      <rect x="10" y="218" width="280" height="6" rx="3" fill="#16211A" opacity="0.15" />
      {bricks.map((b, i) => (
          <g key={i} className="brick">
            <rect x={b.x} y={b.y} width="80" height="38" rx="10" fill="url(#brick)" />
            <circle cx={b.x + 24} cy={b.y + 19} r="6" fill="#16211A" opacity="0.18" />
            <circle cx={b.x + 56} cy={b.y + 19} r="6" fill="#16211A" opacity="0.18" />
          </g>
        ))}
    </svg>
  )
}

const STEPS = [
  {
    n: '01',
    title: 'Cultivo',
    text: ['O bambu cresce rápido e captura carbono enquanto cresce.', 'Colheita em 3 a 5 anos, sem replantio.'],
    tag: 'bambuzal · rebrota sozinho',
    Art: Rings,
    theme: 'bg-creme text-carvao border border-carvao/10',
    panel: 'bg-creme-dark/60',
    img: IMAGES.stalk,
  },
  {
    n: '02',
    title: 'Fibra tratada',
    text: ['Extraímos e tratamos a fibra para que ela dure', 'tanto quanto o cimento ao redor dela.'],
    tag: 'tratamento anti-degradação',
    Art: LaserScan,
    theme: 'bg-carvao text-creme',
    panel: 'bg-black/30',
    img: IMAGES.fiber,
  },
  {
    n: '03',
    title: 'Fabricação sem forno',
    text: ['Fibra, solo e cimento são prensados e curados.', 'Nada é queimado.'],
    tag: 'prensagem + cura',
    Art: Waveform,
    theme: 'bg-taquara text-creme',
    panel: 'bg-carvao/35',
    img: null,
  },
  {
    n: '04',
    title: 'Obra por encaixe',
    text: ['Tijolos de encaixe e placas leves: menos argamassa,', 'menos reboco, menos dias de obra.'],
    tag: 'modular · encaixe',
    Art: BrickStack,
    theme: 'bg-creme-dark text-carvao border border-carvao/10',
    panel: 'bg-creme/70',
    img: IMAGES.house,
  },
]

export default function HowItWorks() {
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = prefersReducedMotion()
      const cards = gsap.utils.toArray('.hw-card')

      // Sticky stacking
      if (!reduced) {
        cards.forEach((card, i) => {
          if (i === cards.length - 1) return
          gsap.to(card.querySelector('.hw-inner'), {
            scale: 0.9,
            filter: 'blur(20px)',
            opacity: 0.5,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: cards[i + 1],
              start: 'top bottom',
              end: 'top top',
              scrub: true,
              pin: card,
              pinSpacing: false,
            },
          })
        })
      }

      if (reduced) return

      // 01 — anéis girando
      gsap.utils.toArray('.ring').forEach((r, i) => {
        gsap.to(r, { rotation: 360 * Number(r.dataset.dir), svgOrigin: '150 150', duration: 40 - i * 7, ease: 'none', repeat: -1 })
      })
      gsap.to('.ring-dot', { opacity: 0.25, stagger: { each: 0.12, repeat: -1, yoyo: true }, duration: 0.8, ease: 'sine.inOut' })

      // 02 — laser escaneando
      const laser = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } })
      laser.fromTo('.laser', { y: 14 }, { y: 206, duration: 2.6 })
      gsap.utils.toArray('.scan-dot').forEach((dot) => {
        const row = Number(dot.dataset.row)
        gsap.to(dot, { opacity: 1, fill: '#E0893F', duration: 0.25, repeat: -1, yoyo: true, repeatDelay: 2.35, delay: 0.1 + row * 0.33 })
      })
      gsap.utils.toArray('.fiber').forEach((f, i) => {
        const len = f.getTotalLength()
        gsap.fromTo(f, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2.6, ease: 'power2.inOut', repeat: -1, yoyo: true, delay: i * 0.18 })
      })

      // 03 — EKG
      const wave = root.current.querySelector('.wave')
      const wl = wave.getTotalLength()
      gsap.fromTo(wave, { strokeDasharray: `${wl * 0.35} ${wl}`, strokeDashoffset: wl * 0.35 }, { strokeDashoffset: -wl, duration: 2.4, ease: 'none', repeat: -1 })

      // 04 — tijolos se empilhando
      const bt = gsap.timeline({ repeat: -1, repeatDelay: 0.8 })
      bt.fromTo('.brick', { y: -70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'bounce.out', stagger: 0.22 }).to('.brick', { opacity: 0, y: 8, duration: 0.5, stagger: 0.03, ease: 'power2.in' }, '+=1.6')
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="como-funciona" data-bamboo ref={root} className="relative" aria-labelledby="hw-title">
      <div className="shell pb-10 pt-24 md:pt-36">
        <p className="eyebrow text-terracota">04 · Como funciona</p>
        <h2 id="hw-title" className="mt-4 max-w-3xl text-[clamp(2.2rem,5vw,4rem)] leading-[1.02] tracking-[-0.04em] text-taquara">
          Do bambuzal à parede, <span className="font-drama font-medium italic text-terracota">em quatro tempos.</span>
        </h2>
      </div>

      <div>
        {STEPS.map(({ n, title, text, tag, Art, theme, panel, img }, i) => (
          <div key={n} style={{ zIndex: i + 1 }} className="hw-card relative flex h-[100dvh] min-h-[560px] items-center pb-4 pl-8 pr-3 pt-[76px] md:pb-6 md:pl-28 md:pr-6 md:pt-24">
            <article className={`hw-inner relative mx-auto grid h-full w-full max-w-6xl grid-cols-1 grid-rows-[auto,minmax(0,1fr)] overflow-hidden rounded-5xl md:grid-cols-2 md:grid-rows-1 ${theme}`}>
              {img && (
                <SmartImage src={img.src} alt="" className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 opacity-[0.12] mix-blend-multiply md:block" />
              )}
              <div className="relative flex flex-col gap-4 p-6 pb-2 md:justify-between md:gap-6 md:p-12">
                <div className="flex items-center justify-between gap-3">
                  <span className="whitespace-nowrap font-mono text-sm tracking-[0.2em] opacity-60">{n} / 04</span>
                  <span className="hidden rounded-full border border-current px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] opacity-60 sm:inline">{tag}</span>
                </div>
                <div>
                  <p className="hidden font-mono text-[clamp(4rem,9vw,7rem)] font-medium leading-none tracking-[-0.06em] opacity-15 md:block">{n}</p>
                  <h3 className="mt-2 text-[clamp(2.2rem,4.6vw,4rem)] leading-[1] tracking-[-0.04em]">{title}</h3>
                  <p className="mt-5 max-w-md text-[17px] leading-relaxed opacity-75 md:text-lg">
                    {text[0]}
                    <br className="hidden md:block" /> {text[1]}
                  </p>
                </div>
              </div>
              <div className="relative flex min-h-0 items-center justify-center p-5 pt-2 md:p-10">
                <div className={`flex aspect-square h-full max-h-[440px] w-auto max-w-full items-center md:h-auto md:w-full md:max-w-[440px] justify-center rounded-[2.5rem] p-6 ${panel}`}>
                  <Art />
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}
