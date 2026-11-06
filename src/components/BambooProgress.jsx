import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useMediaQuery, useReducedMotion } from '../lib/motion'
import { LEAF_PATH, LEAF_RIB } from './ui'

/*
  Bambu de progresso — a assinatura do site.
  Um colmo fixo na lateral esquerda, formado por um segmento por seção ([data-bamboo]).
  Cada segmento cresce com scaleY (0 → 1, origem embaixo) amarrado ao scroll (scrub: true).
  Quando um segmento completa, o nó dá um "pop" e uma folha brota (easing de mola).
  Na última seção (CTA) o colmo chega ao topo e abre a folha final, como na logo.
*/

const DESKTOP = { width: 92, cx: 40, stalk: 13, node: 5, leaf: 0.78, top: 96, bottom: 22 }
const MOBILE = { width: 24, cx: 9, stalk: 4, node: 2.5, leaf: 0.3, top: 76, bottom: 14 }

function useViewportHeight() {
  const [h, setH] = useState(() => (typeof window === 'undefined' ? 800 : window.innerHeight))
  useEffect(() => {
    let w = window.innerWidth
    let t
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(() => {
        // Ignora as pequenas variações da barra de endereço no celular
        if (window.innerWidth !== w || Math.abs(window.innerHeight - h) > 120) {
          w = window.innerWidth
          setH(window.innerHeight)
        }
      }, 150)
    }
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', onResize)
    }
  }, [h])
  return h
}

export default function BambooProgress({ count }) {
  const root = useRef(null)
  const isMobile = useMediaQuery('(max-width: 767px)')
  const reduced = useReducedMotion()
  const H = useViewportHeight()
  const g = isMobile ? MOBILE : DESKTOP

  const geo = useMemo(() => {
    const base = H - g.bottom
    const segH = (base - g.top) / count
    const gap = isMobile ? 2 : 3
    return Array.from({ length: count }, (_, i) => {
      const yTop = base - (i + 1) * segH
      return {
        i,
        y: yTop + gap / 2,
        h: segH - gap,
        nodeY: yTop,
        side: isMobile || i % 2 === 0 ? 1 : -1,
        last: i === count - 1,
      }
    })
  }, [H, g, count, isMobile])

  useEffect(() => {
    const el = root.current
    if (!el) return
    // As seções ficam fora do escopo do contexto: busca no documento inteiro
    const sections = Array.from(document.querySelectorAll('[data-bamboo]'))
    const ctx = gsap.context(() => {
      const segs = gsap.utils.toArray('.bb-seg')
      // Origens definidas enquanto o transform ainda é identidade (evita a compensação do smoothOrigin)
      gsap.set(segs, { transformOrigin: '50% 100%' })
      geo.forEach((s) => {
        gsap.set(`.bb-node-${s.i}`, { transformOrigin: '50% 50%' })
        gsap.set(`.bb-leaf-${s.i}`, { transformOrigin: '0% 100%' })
      })
      const sprouts = geo.map((s) => {
        const tl = gsap.timeline({ paused: true })
        tl.fromTo(`.bb-node-${s.i}`, { scale: 0 }, { scale: 1, duration: 0.35, ease: 'back.out(4)' })
        tl.fromTo(
          `.bb-leaf-${s.i}`,
          { scale: 0, rotation: -28, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, duration: s.last ? 1.1 : 0.8, ease: 'spring' },
          '-=0.12',
        )
        return tl
      })

      if (reduced) {
        gsap.set(segs, { scaleY: 1 })
        sprouts.forEach((tl) => tl.progress(1))
        return
      }

      const state = geo.map(() => false)
      const sync = (i, progress) => {
        const done = progress > 0.995
        if (done !== state[i]) {
          state[i] = done
          if (done) sprouts[i].play()
          else sprouts[i].reverse()
        }
      }

      segs.forEach((seg, i) => {
        const section = sections[i]
        if (!section) return
        const first = i === 0
        const last = i === segs.length - 1
        gsap.fromTo(
          seg,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: first ? 'top top' : 'top center',
              end: last ? 'center center' : 'bottom center',
              scrub: true,
              onUpdate: (self) => sync(i, self.progress),
              onRefresh: (self) => sync(i, self.progress),
            },
          },
        )
      })
    }, el)
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [geo, reduced])

  const leafScale = (s) => (s.last ? g.leaf * 1.45 : g.leaf)
  const half = g.stalk / 2

  return (
    <div
      ref={root}
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-30 h-[100lvh] ${isMobile ? 'opacity-70' : 'left-3'}`}
      style={{ width: g.width }}
    >
      <svg width={g.width} height={H} viewBox={`0 0 ${g.width} ${H}`} className="block overflow-visible">
        <defs>
          <linearGradient id="bb-stalk" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#1F4128" />
            <stop offset="0.32" stopColor="#3E7A4C" />
            <stop offset="0.68" stopColor="#2F5D3A" />
            <stop offset="1" stopColor="#1C3A24" />
          </linearGradient>
          <linearGradient id="bb-leaf" x1="0" x2="1" y1="1" y2="0">
            <stop offset="0" stopColor="#6F9A3E" />
            <stop offset="0.55" stopColor="#8BB653" />
            <stop offset="1" stopColor="#A9CF72" />
          </linearGradient>
        </defs>

        {/* chão: pequenos blocos terracota, como os tijolos da logo */}
        {!isMobile && (
          <g opacity="0.9">
            <rect x={g.cx + half + 4} y={H - g.bottom - 11} width="12" height="9" rx="2.5" fill="#C9622F" />
            <rect x={g.cx + half + 4} y={H - g.bottom - 22} width="12" height="9" rx="2.5" fill="#E0893F" />
            <rect x={g.cx - 22} y={H - g.bottom + 1} width="44" height="3" rx="1.5" fill="#16211A" opacity="0.18" />
          </g>
        )}

        {geo.map((s) => (
          <rect
            key={`seg-${s.i}`}
            className="bb-seg"
            x={g.cx - half}
            y={s.y}
            width={g.stalk}
            height={s.h}
            rx={Math.min(half, 6)}
            fill="url(#bb-stalk)"
            stroke="rgba(247,243,232,0.14)"
            strokeWidth={isMobile ? 0 : 0.75}
          />
        ))}

        {geo.map((s) => (
          <g key={`node-${s.i}`}>
            <rect
              className={`bb-node-${s.i}`}
              x={g.cx - half - (isMobile ? 1.5 : 3)}
              y={s.nodeY - g.node / 2}
              width={g.stalk + (isMobile ? 3 : 6)}
              height={g.node}
              rx={g.node / 2}
              fill="#173320"
            />
            <g
              transform={
                s.last
                  ? `translate(${g.cx + 1} ${s.nodeY + 1}) rotate(-12) scale(${leafScale(s)})`
                  : `translate(${g.cx + s.side * (half - 1)} ${s.nodeY + 1}) scale(${s.side * leafScale(s)} ${leafScale(s)}) rotate(8)`
              }
            >
              <g className={`bb-leaf-${s.i}`}>
                <path d={LEAF_PATH} fill="url(#bb-leaf)" />
                <path d={LEAF_RIB} fill="none" stroke="#F7F3E8" strokeOpacity="0.75" strokeWidth="1.6" strokeLinecap="round" />
              </g>
            </g>
          </g>
        ))}
      </svg>
    </div>
  )
}
