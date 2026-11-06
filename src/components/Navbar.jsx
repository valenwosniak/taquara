import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { gsap, ScrollTrigger, scrollToId } from '../lib/motion'
import { Logo, MagneticButton } from './ui'

const LINKS = [
  { id: 'beneficios', label: 'Benefícios' },
  { id: 'como-funciona', label: 'Como funciona' },
  { id: 'simulador', label: 'Simulador' },
  { id: 'impacto', label: 'Impacto' },
]

export default function Navbar() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#hero',
        start: 'bottom top+=88',
        onEnter: () => setSolid(true),
        onLeaveBack: () => setSolid(false),
        onRefresh: (self) => setSolid(self.scroll() > self.start),
      })
      gsap.from(ref.current, { y: -30, opacity: 0, duration: 1, delay: 0.1 })
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    scrollToId(id)
  }

  const light = !solid && !open

  return (
    <header className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 md:top-5">
      <nav
        ref={ref}
        aria-label="Principal"
        className={`relative w-full max-w-5xl rounded-[2rem] border transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-magnetic ${
          light
            ? 'border-creme/10 bg-carvao/10 backdrop-blur-[2px]'
            : 'border-taquara/15 bg-[#F7F3E8]/60 shadow-[0_10px_40px_-20px_rgba(22,33,26,0.35)] backdrop-blur-xl'
        }`}
      >
        <div className="flex items-center justify-between gap-3 py-2 pl-5 pr-2 md:pl-6">
          <a href="#hero" onClick={go('hero')} className="lift flex shrink-0 items-center" aria-label="Taquara — início">
            <Logo light={light} className="h-6 md:h-7" />
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={go(l.id)}
                  className={`lift inline-block rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors ${
                    light ? 'text-creme/85 hover:text-creme' : 'text-taquara hover:text-carvao'
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <MagneticButton variant="terracota" className="!px-4 !py-2.5 text-[13px] md:!px-5 md:text-[14px]" onClick={() => scrollToId('simulador')}>
              <span>Simule sua obra</span>
            </MagneticButton>
            <button
              type="button"
              className={`lift grid h-10 w-10 place-items-center rounded-full md:hidden ${light ? 'text-creme' : 'text-taquara'}`}
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={open}
              aria-controls="menu-mobile"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <div
          id="menu-mobile"
          className={`grid overflow-hidden transition-[grid-template-rows] duration-500 ease-magnetic md:hidden ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        >
          <ul className="min-h-0 px-3">
            {LINKS.map((l, i) => (
              <li key={l.id} className={i === LINKS.length - 1 ? 'pb-3' : ''}>
                <a
                  href={`#${l.id}`}
                  tabIndex={open ? 0 : -1}
                  onClick={go(l.id)}
                  className="flex items-center justify-between rounded-2xl px-3 py-3 font-heading text-lg font-semibold text-taquara hover:bg-taquara/5"
                >
                  {l.label}
                  <span className="font-mono text-[11px] text-carvao/40">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}
