import { useEffect, useRef, useState } from 'react'
import { Check, LoaderCircle, X } from 'lucide-react'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { LEAF_PATH, MagneticButton } from './ui'

const TIPOS = ['Casa', 'Reforma', 'Comercial', 'Outro']
const EMPTY = { nome: '', email: '', cidade: '', tipo: '' }

export default function SampleModal({ open, onClose }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | done
  const panel = useRef(null)
  const first = useRef(null)
  const lastFocus = useRef(null)

  useEffect(() => {
    if (!open) return
    lastFocus.current = document.activeElement
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll('button, input, select, [href]')
        const a = f[0]
        const z = f[f.length - 1]
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault()
          z.focus()
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault()
          a.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    requestAnimationFrame(() => first.current?.focus())
    let ctx
    if (!prefersReducedMotion()) {
      ctx = gsap.context(() => {
        gsap.from('.sm-backdrop', { opacity: 0, duration: 0.4, ease: 'power2.out' })
        gsap.from(panel.current, { y: 40, opacity: 0, scale: 0.97, duration: 0.6, ease: 'power3.out' })
      })
    }
    return () => {
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      ctx?.revert()
      lastFocus.current?.focus?.()
    }
  }, [open, onClose])

  useEffect(() => {
    if (open) return
    const t = setTimeout(() => {
      setStatus('idle')
      setForm(EMPTY)
      setErrors({})
    }, 300)
    return () => clearTimeout(t)
  }, [open])

  if (!open) return null

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (form.nome.trim().length < 2) er.nome = 'Informe seu nome.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) er.email = 'Informe um e-mail válido.'
    if (form.cidade.trim().length < 2) er.cidade = 'Informe sua cidade.'
    if (!form.tipo) er.tipo = 'Escolha o tipo de obra.'
    setErrors(er)
    if (Object.keys(er).length) return
    setStatus('sending')
    setTimeout(() => setStatus('done'), 1100)
  }

  const field = 'mt-1.5 w-full rounded-2xl border bg-white/70 px-4 py-3 text-[15px] text-carvao outline-none transition-colors placeholder:text-carvao/35 focus:border-terracota'
  const err = (k) => (errors[k] ? 'border-terracota' : 'border-carvao/15')

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-3 sm:items-center" role="presentation">
      <div className="sm-backdrop absolute inset-0 bg-carvao/70 backdrop-blur-md" onClick={onClose} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sm-title"
        className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-5xl bg-creme p-6 shadow-lift md:p-9"
      >
        <button type="button" onClick={onClose} className="lift absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-carvao/5 text-carvao hover:bg-carvao/10" aria-label="Fechar">
          <X size={18} />
        </button>

        {status !== 'done' ? (
          <form onSubmit={submit} noValidate>
            <p className="eyebrow text-terracota">amostra grátis</p>
            <h2 id="sm-title" className="mt-2 pr-10 text-[30px] leading-tight tracking-[-0.035em] text-taquara">
              Sinta a fibra <span className="font-drama font-medium italic text-terracota">nas mãos.</span>
            </h2>
            <p className="mt-2 text-[15px] text-carvao/60">Enviamos um Tijolo e um recorte de Placa Taquara para você avaliar.</p>

            <div className="mt-6 grid gap-4">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-carvao/55">Nome</span>
                <input ref={first} value={form.nome} onChange={set('nome')} autoComplete="name" placeholder="Como podemos te chamar?" className={`${field} ${err('nome')}`} aria-invalid={!!errors.nome} />
                {errors.nome && <span className="mt-1 block text-[12px] text-terracota">{errors.nome}</span>}
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-carvao/55">E-mail</span>
                <input type="email" value={form.email} onChange={set('email')} autoComplete="email" placeholder="voce@exemplo.com" className={`${field} ${err('email')}`} aria-invalid={!!errors.email} />
                {errors.email && <span className="mt-1 block text-[12px] text-terracota">{errors.email}</span>}
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-carvao/55">Cidade</span>
                  <input value={form.cidade} onChange={set('cidade')} autoComplete="address-level2" placeholder="Ex.: Curitiba" className={`${field} ${err('cidade')}`} aria-invalid={!!errors.cidade} />
                  {errors.cidade && <span className="mt-1 block text-[12px] text-terracota">{errors.cidade}</span>}
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-carvao/55">Tipo de obra</span>
                  <select value={form.tipo} onChange={set('tipo')} className={`${field} ${err('tipo')} appearance-none`} aria-invalid={!!errors.tipo}>
                    <option value="">Selecione</option>
                    {TIPOS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                  {errors.tipo && <span className="mt-1 block text-[12px] text-terracota">{errors.tipo}</span>}
                </label>
              </div>
            </div>

            <MagneticButton type="submit" variant="terracota" className="mt-7 w-full" disabled={status === 'sending'}>
              {status === 'sending' && <LoaderCircle size={18} className="animate-spin" />}
              <span>{status === 'sending' ? 'Enviando…' : 'Quero minha amostra'}</span>
            </MagneticButton>
            <p className="mt-3 text-center font-mono text-[10px] text-carvao/45">Projeto acadêmico: nenhum dado é enviado ou armazenado.</p>
          </form>
        ) : (
          <div className="py-6 text-center" aria-live="polite">
            <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-taquara text-creme">
              <Check size={34} strokeWidth={2.5} />
              <svg viewBox="-4 -46 50 50" className="absolute -right-5 -top-6 h-12 w-12" aria-hidden="true">
                <path d={LEAF_PATH} fill="#8BB653" />
              </svg>
            </div>
            <h2 id="sm-title" className="mt-6 text-[28px] leading-tight tracking-[-0.035em] text-taquara">
              Pedido recebido, {form.nome.trim().split(' ')[0]}!
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-[15px] text-carvao/65">
              Sua amostra de obra {form.tipo.toLowerCase()} vai para {form.cidade.trim()}. Enviamos a confirmação para <strong className="font-semibold text-carvao">{form.email.trim()}</strong>.
            </p>
            <p className="mt-4 font-mono text-[11px] text-carvao/45">(simulação · nenhum e-mail foi enviado)</p>
            <MagneticButton variant="verde" className="mt-7" onClick={onClose}>
              <span>Voltar ao site</span>
            </MagneticButton>
          </div>
        )}
      </div>
    </div>
  )
}
