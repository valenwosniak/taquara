import { useState } from 'react'
import { asset } from '../lib/images'

/* Botão magnético: scale(1.03) no hover + <span> de fundo que desliza. */
const VARIANTS = {
  terracota: { base: 'bg-terracota text-creme shadow-[0_12px_30px_-12px_rgba(201,98,47,0.7)]', fill: 'bg-carvao' },
  verde: { base: 'bg-taquara text-creme', fill: 'bg-carvao' },
  creme: { base: 'bg-creme text-carvao', fill: 'bg-folha' },
  ghostLight: { base: 'border border-creme/35 text-creme hover:text-carvao', fill: 'bg-creme' },
  ghostDark: { base: 'border border-carvao/20 text-carvao hover:text-creme', fill: 'bg-taquara' },
}

export function MagneticButton({ as = 'button', variant = 'terracota', className = '', children, ...props }) {
  const Tag = as
  const v = VARIANTS[variant]
  return (
    <Tag className={`btn-magnetic ${v.base} ${className}`} {...(Tag === 'button' && !props.type ? { type: 'button' } : {})} {...props}>
      <span className={`btn-fill ${v.fill}`} aria-hidden="true" />
      {children}
    </Tag>
  )
}

/* Imagem com fallback em degradê da paleta — nunca mostra imagem quebrada. */
export function SmartImage({ src, alt = '', className = '', imgClassName = '', loading = 'lazy', fetchPriority, ...rest }) {
  const [state, setState] = useState('loading')
  return (
    <div className={`img-fallback overflow-hidden ${className}`} {...rest}>
      {state !== 'error' && (
        <img
          src={src}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding="async"
          onLoad={() => setState('ok')}
          onError={() => setState('error')}
          className={`h-full w-full object-cover transition-opacity duration-700 ${state === 'ok' ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        />
      )}
    </div>
  )
}

/* Logo oficial. `light` aplica brightness(0) invert(1) para fundos escuros. */
export function Logo({ light = false, className = 'h-7' }) {
  return (
    <img
      src={asset('logo-taquara-clean.png')}
      alt="Taquara"
      width="619"
      height="238"
      className={`w-auto transition-[filter] duration-500 ${className}`}
      style={{ filter: light ? 'brightness(0) invert(1)' : 'none' }}
    />
  )
}

/* Nota "(estimativa)" em mono */
export function Estimate({ className = '', children = '(estimativa)' }) {
  return <span className={`estimate ${className}`}>{children}</span>
}

/* Ícones de redes (Lucide v1 não traz marcas) */
export const SocialIcons = {
  Instagram: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  ),
  LinkedIn: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
    </svg>
  ),
  YouTube: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10.5 9.5 4 2.5-4 2.5z" fill="currentColor" />
    </svg>
  ),
}

/* Folha estilizada (mesma da logo): base em (0,0), ponta para cima/direita. */
export const LEAF_PATH = 'M0,0 C1,-17 13,-34 42,-41 C35,-21 22,-4 0,0 Z'
export const LEAF_RIB = 'M3,-3 C14,-15 24,-26 37,-37'
