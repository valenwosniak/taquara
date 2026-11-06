/* ═══════════════════════════════════════════════════════════════════════
   PARÂMETROS DO SIMULADOR TAQUARA
   Valores estimados para fins de demonstração (projeto acadêmico).
   Ajuste aqui sem mexer na interface.
   ═══════════════════════════════════════════════════════════════════════ */

// Área de parede aceita no simulador (m²)
const AREA_MIN = 5
const AREA_MAX = 600
const AREA_PADRAO = 40

// Tijolo Taquara: referência de 64 tijolos por m² de parede
const TIJOLOS_POR_M2 = 64

// Placa Taquara: 1,20 m × 2,40 m = 2,88 m² por placa
const AREA_PLACA_M2 = 2.88

// Margem de perda aplicada à quantidade (cortes, quebras): 5%
const MARGEM_PERDA = 0.05

// Faixa de economia no custo total da parede (menos argamassa, menos reboco, obra mais rápida)
const ECONOMIA_MIN = 0.2
const ECONOMIA_MAX = 0.4

// Custo de referência da parede convencional (tijolo comum + argamassa + reboco), em R$/m²
const CUSTO_PAREDE_CONVENCIONAL_M2 = 190

// Produtividade da parede convencional (levantar + rebocar), em m² por dia de equipe
const PRODUTIVIDADE_CONVENCIONAL_M2_DIA = 8

// Emissões de referência da parede convencional (queima do tijolo + argamassa + reboco), em kg CO₂/m²
const CO2_CONVENCIONAL_KG_M2 = 38

// Produtos Taquara
const PRODUTOS = {
  tijolo: {
    nome: 'Tijolo Taquara',
    unidade: 'tijolos',
    unidadesPorM2: TIJOLOS_POR_M2,
    produtividadeM2Dia: 13, // m²/dia: encaixe modular, quase sem reboco
    co2KgM2: 14, // kg CO₂/m²: sem forno
    ajusteEconomia: 0, // soma à economia do tipo de obra
    descricao: 'Solo-cimento + fibra. Paredes e muros.',
  },
  placa: {
    nome: 'Placa Taquara',
    unidade: 'placas',
    unidadesPorM2: 1 / AREA_PLACA_M2,
    produtividadeM2Dia: 22, // m²/dia: placas leves, fixação a seco
    co2KgM2: 9,
    ajusteEconomia: -0.04,
    descricao: 'Fibra de bambu. Forros e paredes internas.',
  },
}

// Tipos de obra: ponto central da economia dentro da faixa de 20% a 40%
const TIPOS_OBRA = {
  casa: { nome: 'Casa', economia: 0.3 },
  reforma: { nome: 'Reforma', economia: 0.24 },
  comercial: { nome: 'Comercial', economia: 0.36 },
}

// Linha do tempo do pedido de amostra
const ETAPAS_PEDIDO = ['Pedido recebido', 'Produção', 'Cura', 'Entrega']

/* ═══════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, BrickWall, Calculator, Check, ChartColumn, Home, LoaderCircle, Package, PanelTop, Store, Wrench } from 'lucide-react'
import { gsap, prefersReducedMotion, STAGGER_TEXT } from '../lib/motion'
import { asset } from '../lib/images'
import { Estimate, MagneticButton } from './ui'

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
const int = (v) => Math.round(v).toLocaleString('pt-BR')

function calcular({ area, produto, tipo }) {
  const p = PRODUTOS[produto]
  const t = TIPOS_OBRA[tipo]
  const quantidade = Math.ceil(area * p.unidadesPorM2 * (1 + MARGEM_PERDA))
  const custoConvencional = area * CUSTO_PAREDE_CONVENCIONAL_M2
  const pct = clamp(t.economia + p.ajusteEconomia, ECONOMIA_MIN, ECONOMIA_MAX)
  const diasConvencional = Math.max(1, Math.ceil(area / PRODUTIVIDADE_CONVENCIONAL_M2_DIA))
  const diasTaquara = Math.max(1, Math.ceil(area / p.produtividadeM2Dia))
  const co2Convencional = area * CO2_CONVENCIONAL_KG_M2
  const co2Taquara = area * p.co2KgM2
  return {
    id: `${area}-${produto}-${tipo}-${Date.now()}`,
    area,
    produto,
    tipo,
    quantidade,
    pct,
    custoConvencional,
    custoTaquara: custoConvencional * (1 - pct),
    economia: custoConvencional * pct,
    economiaMin: custoConvencional * ECONOMIA_MIN,
    economiaMax: custoConvencional * ECONOMIA_MAX,
    diasConvencional,
    diasTaquara,
    diasEconomizados: Math.max(0, diasConvencional - diasTaquara),
    co2Convencional,
    co2Taquara,
    co2Evitado: co2Convencional - co2Taquara,
  }
}

/* Número que anima ao aparecer */
function useCountUp(target, key, duration = 1100) {
  const [v, setV] = useState(prefersReducedMotion() ? target : 0)
  useEffect(() => {
    if (prefersReducedMotion()) {
      setV(target)
      return
    }
    let raf
    const t0 = performance.now()
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / duration)
      setV(target * (1 - Math.pow(1 - k, 3)))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, key, duration])
  return v
}

function Count({ value, k, format = int }) {
  return <span className="tabular">{format(useCountUp(value, k))}</span>
}

/* ───────── Tela 1: Simular ───────── */
function ScreenSimular({ form, setForm, onCalc, loading }) {
  const [draft, setDraft] = useState(String(form.area))
  useEffect(() => setDraft(String(form.area)), [form.area])

  const commit = (raw) => {
    const n = clamp(Math.round(Number(String(raw).replace(',', '.')) || AREA_MIN), AREA_MIN, AREA_MAX)
    setForm((f) => ({ ...f, area: n }))
    setDraft(String(n))
  }
  const pct = ((form.area - AREA_MIN) / (AREA_MAX - AREA_MIN)) * 100

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-heading text-[22px] font-bold leading-tight tracking-[-0.03em] text-carvao">Simule sua obra</h3>
        <p className="mt-1 text-[13px] text-carvao/55">Três respostas e a gente estima o resto.</p>
      </div>

      <fieldset className="rounded-[1.5rem] border border-carvao/10 bg-white/60 p-4">
        <legend className="sr-only">Área de parede</legend>
        <div className="flex items-end justify-between gap-3">
          <label htmlFor="sim-area" className="font-mono text-[10px] uppercase tracking-[0.16em] text-carvao/50">
            Área de parede
          </label>
          <div className="flex items-baseline gap-1 rounded-full border border-carvao/15 bg-creme px-3 py-1 focus-within:border-terracota">
            <input
              id="sim-area"
              inputMode="numeric"
              value={draft}
              onChange={(e) => setDraft(e.target.value.replace(/[^\d,.]/g, ''))}
              onBlur={(e) => commit(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && commit(e.currentTarget.value)}
              className="tabular w-14 bg-transparent text-right font-mono text-[18px] font-medium text-carvao outline-none"
              aria-describedby="sim-area-hint"
            />
            <span className="font-mono text-[12px] text-carvao/50">m²</span>
          </div>
        </div>
        <input
          type="range"
          min={AREA_MIN}
          max={AREA_MAX}
          step="1"
          value={form.area}
          onChange={(e) => setForm((f) => ({ ...f, area: Number(e.target.value) }))}
          aria-label="Área de parede em metros quadrados"
          className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full accent-terracota"
          style={{ background: `linear-gradient(90deg, #C9622F ${pct}%, rgba(22,33,26,0.12) ${pct}%)` }}
        />
        <p id="sim-area-hint" className="mt-2 flex justify-between font-mono text-[10px] text-carvao/40">
          <span>{AREA_MIN} m²</span>
          <span>{AREA_MAX} m²</span>
        </p>
      </fieldset>

      <fieldset>
        <legend className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-carvao/50">Produto</legend>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(PRODUTOS).map(([k, p]) => {
            const active = form.produto === k
            const Icon = k === 'tijolo' ? BrickWall : PanelTop
            return (
              <button
                key={k}
                type="button"
                aria-pressed={active}
                onClick={() => setForm((f) => ({ ...f, produto: k }))}
                className={`rounded-[1.4rem] border p-3 text-left transition-all duration-300 ease-magnetic ${
                  active ? 'border-taquara bg-taquara text-creme shadow-lg' : 'border-carvao/10 bg-white/60 text-carvao hover:border-taquara/40'
                }`}
              >
                <Icon size={18} className={active ? 'text-folha' : 'text-terracota'} />
                <p className="mt-2 font-heading text-[14px] font-semibold leading-tight">{p.nome.replace(' Taquara', '')}</p>
                <p className={`mt-0.5 text-[11px] leading-snug ${active ? 'text-creme/70' : 'text-carvao/50'}`}>{p.descricao}</p>
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-carvao/50">Tipo de obra</legend>
        <div className="flex gap-1.5 rounded-full bg-carvao/[0.06] p-1">
          {Object.entries(TIPOS_OBRA).map(([k, t]) => {
            const active = form.tipo === k
            const Icon = { casa: Home, reforma: Wrench, comercial: Store }[k]
            return (
              <button
                key={k}
                type="button"
                aria-pressed={active}
                onClick={() => setForm((f) => ({ ...f, tipo: k }))}
                className={`flex flex-1 items-center justify-center gap-1 rounded-full py-2 font-heading text-[12.5px] font-semibold transition-all duration-300 ease-magnetic ${
                  active ? 'bg-creme text-taquara shadow' : 'text-carvao/55 hover:text-carvao'
                }`}
              >
                <Icon size={13} />
                {t.nome}
              </button>
            )
          })}
        </div>
      </fieldset>

      <MagneticButton variant="terracota" className="w-full" onClick={onCalc} disabled={loading}>
        {loading ? <LoaderCircle size={18} className="animate-spin" /> : <Calculator size={18} />}
        <span>{loading ? 'Calculando…' : 'Calcular'}</span>
      </MagneticButton>
    </div>
  )
}

/* ───────── Tela 2: Resultado ───────── */
function Bars({ label, a, b, unit, k }) {
  const [on, setOn] = useState(prefersReducedMotion())
  useEffect(() => {
    setOn(false)
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)))
    return () => cancelAnimationFrame(id)
  }, [k])
  const hb = (b / a) * 100
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-24 items-end gap-1.5">
        <div className="relative w-6 overflow-hidden rounded-full bg-carvao/[0.06]" style={{ height: '100%' }}>
          <div className="absolute inset-x-0 bottom-0 rounded-full bg-carvao/30 transition-[height] duration-1000 ease-magnetic" style={{ height: on ? '100%' : '0%' }} />
        </div>
        <div className="relative w-6 overflow-hidden rounded-full bg-carvao/[0.06]" style={{ height: '100%' }}>
          <div
            className="absolute inset-x-0 bottom-0 rounded-full bg-gradient-to-t from-taquara to-folha transition-[height] delay-150 duration-1000 ease-spring"
            style={{ height: on ? `${hb}%` : '0%' }}
          />
        </div>
      </div>
      <p className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-carvao/55">{label}</p>
      <p className="font-mono text-[9px] text-terracota">−{Math.round(100 - hb)}%{unit}</p>
    </div>
  )
}

function ScreenResultado({ result, goTo }) {
  if (!result) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-folha/20 text-taquara">
          <ChartColumn size={22} />
        </span>
        <p className="mt-4 font-heading text-lg font-semibold text-carvao">Nenhuma simulação ainda</p>
        <p className="mt-1 max-w-[220px] text-[13px] text-carvao/55">Informe a área e o produto para ver o resultado.</p>
        <button type="button" onClick={() => goTo('simular')} className="lift mt-5 inline-flex items-center gap-1 font-heading text-[14px] font-semibold text-terracota">
          Ir para Simular <ArrowRight size={15} />
        </button>
      </div>
    )
  }
  const p = PRODUTOS[result.produto]
  const k = result.id
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-carvao/50">
            {TIPOS_OBRA[result.tipo].nome} · {int(result.area)} m²
          </p>
          <h3 className="mt-1 font-heading text-[20px] font-bold leading-tight tracking-[-0.03em] text-carvao">Seu resultado</h3>
        </div>
        <span className="rounded-full bg-folha/25 px-2.5 py-1 font-mono text-[10px] text-taquara">{p.nome}</span>
      </div>

      <div className="rounded-[1.5rem] bg-taquara p-4 text-creme">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-creme/60">Quantidade estimada</p>
        <p className="mt-1 font-drama text-[44px] font-medium italic leading-none">
          <Count value={result.quantidade} k={k} /> <span className="font-heading text-base font-semibold not-italic">{p.unidade}</span>
        </p>
        <p className="mt-1 font-mono text-[10px] text-creme/55">
          {result.produto === 'tijolo' ? `${TIJOLOS_POR_M2} tijolos/m²` : `placas de ${String(AREA_PLACA_M2).replace('.', ',')} m²`} + {MARGEM_PERDA * 100}% de margem
        </p>
      </div>

      <div className="rounded-[1.5rem] border border-carvao/10 bg-white/60 p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-carvao/50">
          Economia na parede <Estimate />
        </p>
        <p className="mt-1 font-heading text-[28px] font-bold leading-none tracking-[-0.03em] text-terracota">
          <Count value={result.economia} k={k} format={brl} />
        </p>
        <p className="mt-1 font-mono text-[10.5px] text-carvao/55">
          faixa: {brl(result.economiaMin)} a {brl(result.economiaMax)} (20% a 40%)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-[1.4rem] border border-carvao/10 bg-white/60 p-3">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-carvao/50">Dias economizados</p>
          <p className="mt-1 font-heading text-[24px] font-bold leading-none text-taquara">
            <Count value={result.diasEconomizados} k={k} />
            <span className="ml-1 text-[12px] font-semibold text-carvao/50">dias</span>
          </p>
          <Estimate />
        </div>
        <div className="rounded-[1.4rem] border border-carvao/10 bg-white/60 p-3">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-carvao/50">CO₂ evitado</p>
          <p className="mt-1 font-heading text-[24px] font-bold leading-none text-taquara">
            <Count value={result.co2Evitado} k={k} />
            <span className="ml-1 text-[12px] font-semibold text-carvao/50">kg</span>
          </p>
          <Estimate />
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-carvao/10 bg-white/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-carvao/50">Comum vs Taquara</p>
          <div className="flex items-center gap-2 font-mono text-[9px] text-carvao/50">
            <span className="flex items-center gap-1">
              <i className="h-2 w-2 rounded-full bg-carvao/30" />
              comum
            </span>
            <span className="flex items-center gap-1">
              <i className="h-2 w-2 rounded-full bg-folha" />
              taquara
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3">
          <Bars label="custo" a={result.custoConvencional} b={result.custoTaquara} unit="" k={k} />
          <Bars label="prazo" a={result.diasConvencional} b={result.diasTaquara} unit="" k={k} />
          <Bars label="CO₂" a={result.co2Convencional} b={result.co2Taquara} unit="" k={k} />
        </div>
      </div>

      <MagneticButton variant="verde" className="w-full" onClick={() => goTo('pedido')}>
        <span>Continuar para o pedido</span>
        <ArrowRight size={17} />
      </MagneticButton>
    </div>
  )
}

/* ───────── Tela 3: Pedido ───────── */
function ScreenPedido({ result, order, onOrder, goTo }) {
  if (!result) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-terracota/15 text-terracota">
          <Package size={22} />
        </span>
        <p className="mt-4 font-heading text-lg font-semibold text-carvao">Simule antes de pedir</p>
        <p className="mt-1 max-w-[220px] text-[13px] text-carvao/55">A amostra é separada de acordo com o produto da sua simulação.</p>
        <button type="button" onClick={() => goTo('simular')} className="lift mt-5 inline-flex items-center gap-1 font-heading text-[14px] font-semibold text-terracota">
          Ir para Simular <ArrowRight size={15} />
        </button>
      </div>
    )
  }
  const p = PRODUTOS[result.produto]
  const placed = order.status === 'done'
  const rows = [
    ['Produto', p.nome],
    ['Obra', `${TIPOS_OBRA[result.tipo].nome} · ${int(result.area)} m²`],
    ['Quantidade', `${int(result.quantidade)} ${p.unidade}`],
    ['Economia', `${brl(result.economia)} (estimativa)`],
  ]
  return (
    <div className="space-y-3">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-carvao/50">{placed ? `protocolo ${order.protocol}` : 'resumo'}</p>
        <h3 className="mt-1 font-heading text-[20px] font-bold leading-tight tracking-[-0.03em] text-carvao">{placed ? 'Amostra a caminho' : 'Seu pedido'}</h3>
      </div>

      <dl className="divide-y divide-carvao/10 rounded-[1.5rem] border border-carvao/10 bg-white/60 px-4">
        {rows.map(([dt, dd]) => (
          <div key={dt} className="flex items-center justify-between gap-3 py-2.5">
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-carvao/50">{dt}</dt>
            <dd className="text-right font-heading text-[13px] font-semibold text-carvao">{dd}</dd>
          </div>
        ))}
      </dl>

      {!placed ? (
        <MagneticButton variant="terracota" className="w-full" onClick={onOrder} disabled={order.status === 'sending'}>
          {order.status === 'sending' ? <LoaderCircle size={18} className="animate-spin" /> : <Package size={18} />}
          <span>{order.status === 'sending' ? 'Enviando…' : 'Pedir amostra grátis'}</span>
        </MagneticButton>
      ) : (
        <p className="flex items-center gap-2 rounded-full bg-folha/20 px-4 py-2.5 font-heading text-[13px] font-semibold text-taquara">
          <Check size={16} /> Pedido confirmado. Acompanhe abaixo.
        </p>
      )}

      <div className="rounded-[1.5rem] border border-carvao/10 bg-white/60 p-4">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-carvao/50">Acompanhamento</p>
        <ol className="relative space-y-3.5">
          <span className="absolute bottom-2 left-[9px] top-2 w-px bg-carvao/10" aria-hidden="true" />
          {ETAPAS_PEDIDO.map((etapa, i) => {
            const done = placed && i < order.step
            const current = placed && i === order.step
            return (
              <li key={etapa} className="relative flex items-center gap-3">
                <span
                  className={`relative z-10 grid h-[19px] w-[19px] place-items-center rounded-full border-2 transition-colors duration-500 ${
                    done ? 'border-taquara bg-taquara text-creme' : current ? 'border-terracota bg-creme text-terracota' : 'border-carvao/15 bg-creme'
                  }`}
                >
                  {done && <Check size={11} strokeWidth={3} />}
                  {current && <span className="pulse-dot h-2 w-2 rounded-full bg-terracota text-terracota" />}
                </span>
                <span className={`font-heading text-[13.5px] ${done || current ? 'font-semibold text-carvao' : 'text-carvao/40'}`}>{etapa}</span>
                {current && <span className="ml-auto font-mono text-[10px] text-terracota">agora</span>}
                {done && <span className="ml-auto font-mono text-[10px] text-carvao/40">ok</span>}
              </li>
            )
          })}
        </ol>
        {!placed && <p className="mt-3 font-mono text-[10px] text-carvao/40">aguardando pedido</p>}
        {placed && <p className="mt-3 font-mono text-[10px] text-carvao/45">previsão de entrega: 7 dias úteis (estimativa)</p>}
      </div>
    </div>
  )
}

/* ───────── Smartphone ───────── */
const TABS = [
  { id: 'simular', label: 'Simular', icon: Calculator },
  { id: 'resultado', label: 'Resultado', icon: ChartColumn },
  { id: 'pedido', label: 'Pedido', icon: Package },
]

export default function Simulator() {
  const root = useRef(null)
  const screenRef = useRef(null)
  const [tab, setTab] = useState('simular')
  const [form, setForm] = useState({ area: AREA_PADRAO, produto: 'tijolo', tipo: 'casa' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState({ status: 'idle', step: 0, protocol: '' })
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms))

  const goTo = (id) => {
    setTab(id)
    screenRef.current?.scrollTo({ top: 0 })
  }

  const onCalc = () => {
    setLoading(true)
    later(() => {
      setResult(calcular(form))
      setOrder({ status: 'idle', step: 0, protocol: '' })
      setLoading(false)
      goTo('resultado')
    }, 650)
  }

  const onOrder = () => {
    setOrder((o) => ({ ...o, status: 'sending' }))
    later(() => {
      const protocol = `TQ-${String(Date.now()).slice(-6)}`
      setOrder({ status: 'done', step: 0, protocol })
      later(() => setOrder((o) => ({ ...o, step: 1 })), 1400)
    }, 900)
  }

  // transição entre telas
  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = screenRef.current?.firstElementChild
    if (el) gsap.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
  }, [tab, result?.id])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.sim-copy > *', { y: 40, opacity: 0, stagger: STAGGER_TEXT, scrollTrigger: { trigger: root.current, start: 'top 70%' } })
      gsap.from('.sim-phone', { y: 90, rotate: -3, opacity: 0, duration: 1.3, scrollTrigger: { trigger: root.current, start: 'top 70%' } })
    }, root)
    return () => ctx.revert()
  }, [])

  const steps = [
    { id: 'simular', t: 'Simular', d: 'Área de parede, produto (tijolo ou placa) e tipo de obra.' },
    { id: 'resultado', t: 'Resultado', d: 'Quantidade, economia, dias de obra e CO₂ evitado, comparados ao tijolo comum.' },
    { id: 'pedido', t: 'Pedido', d: 'Peça uma amostra grátis e acompanhe da produção à entrega.' },
  ]

  return (
    <section id="simulador" data-bamboo ref={root} className="relative overflow-hidden bg-creme-dark/60 py-24 md:py-36" aria-labelledby="sim-title">
      <div className="pointer-events-none absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-folha/20 blur-3xl" aria-hidden="true" />
      <div className="shell relative grid items-center gap-14 lg:grid-cols-[1fr,auto] lg:gap-20">
        <div className="sim-copy max-w-xl">
          <p className="eyebrow text-terracota">05 · Simulador Taquara</p>
          <h2 id="sim-title" className="mt-4 text-[clamp(2.2rem,5vw,4rem)] leading-[1.02] tracking-[-0.04em] text-taquara">
            Sua obra, <span className="font-drama font-medium italic text-terracota">em números.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-carvao/70">
            O app da Taquara transforma a área da sua parede em uma estimativa de material, custo, prazo e carbono. Experimente: tudo aqui ao lado funciona.
          </p>
          <ol className="mt-8 space-y-2">
            {steps.map((s, i) => {
              const active = tab === s.id
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => goTo(s.id)}
                    className={`lift flex w-full items-start gap-4 rounded-[1.75rem] border p-4 text-left transition-colors duration-300 ${
                      active ? 'border-taquara/20 bg-creme shadow-card' : 'border-transparent hover:bg-creme/60'
                    }`}
                  >
                    <span className={`mt-0.5 font-mono text-[12px] ${active ? 'text-terracota' : 'text-carvao/35'}`}>0{i + 1}</span>
                    <span>
                      <span className={`block font-heading text-lg font-semibold ${active ? 'text-carvao' : 'text-carvao/60'}`}>{s.t}</span>
                      <span className="mt-0.5 block text-[14.5px] leading-relaxed text-carvao/55">{s.d}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
          <p className="mt-6 font-mono text-[11px] text-carvao/50">Valores estimados para fins de demonstração.</p>
        </div>

        {/* Mockup do smartphone */}
        <div className="sim-phone mx-auto w-full max-w-[360px] lg:mx-0">
          <div className="relative rounded-[3.2rem] bg-carvao p-[11px] shadow-phone">
            <div className="absolute -left-[3px] top-28 h-12 w-[3px] rounded-l-full bg-carvao" aria-hidden="true" />
            <div className="absolute -right-[3px] top-36 h-16 w-[3px] rounded-r-full bg-carvao" aria-hidden="true" />
            <div className="relative flex h-[min(720px,calc(100dvh-120px))] min-h-[600px] flex-col overflow-hidden rounded-[2.5rem] bg-creme">
              {/* status bar */}
              <div className="relative flex items-center justify-between px-7 pb-1 pt-3.5 font-mono text-[11px] font-medium text-carvao">
                <span>9:41</span>
                <span className="absolute left-1/2 top-2.5 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-carvao" aria-hidden="true" />
                <span className="flex items-center gap-1" aria-hidden="true">
                  <span className="flex items-end gap-[2px]">
                    {[4, 6, 8, 10].map((h) => (
                      <i key={h} className="w-[3px] rounded-full bg-carvao" style={{ height: h }} />
                    ))}
                  </span>
                  <span className="ml-1 h-[10px] w-[20px] rounded-[4px] border border-carvao/70 p-[1.5px]">
                    <i className="block h-full w-3/4 rounded-[2px] bg-carvao" />
                  </span>
                </span>
              </div>
              {/* app header */}
              <div className="flex items-center justify-between px-5 pb-3 pt-2">
                <img src={asset('favicon-180.png')} alt="" className="h-7 w-7" />
                <p className="font-heading text-[13px] font-semibold text-carvao">Taquara · Simulador</p>
                <span className="flex items-center gap-1 rounded-full bg-folha/20 px-2 py-0.5 font-mono text-[9px] text-taquara">
                  <span className="h-1.5 w-1.5 rounded-full bg-folha" />
                  demo
                </span>
              </div>

              <div ref={screenRef} className="no-scrollbar flex-1 overflow-y-auto px-5 pb-5" aria-live="polite">
                <div className="min-h-full">
                  {tab === 'simular' && <ScreenSimular form={form} setForm={setForm} onCalc={onCalc} loading={loading} />}
                  {tab === 'resultado' && <ScreenResultado result={result} goTo={goTo} />}
                  {tab === 'pedido' && <ScreenPedido result={result} order={order} onOrder={onOrder} goTo={goTo} />}
                </div>
              </div>

              {/* tabs */}
              <nav aria-label="Telas do simulador" className="border-t border-carvao/10 bg-creme/95 px-3 pb-4 pt-2 backdrop-blur">
                <div role="tablist" className="flex gap-1">
                  {TABS.map(({ id, label, icon: Icon }) => {
                    const active = tab === id
                    return (
                      <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => goTo(id)}
                        className={`flex flex-1 flex-col items-center gap-0.5 rounded-[1.25rem] py-2 font-heading text-[11px] font-semibold transition-colors duration-300 ${
                          active ? 'bg-terracota/10 text-terracota' : 'text-carvao/45 hover:text-carvao'
                        }`}
                      >
                        <Icon size={18} />
                        {label}
                      </button>
                    )
                  })}
                </div>
                <div className="mx-auto mt-2 h-1 w-28 rounded-full bg-carvao/80" aria-hidden="true" />
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
