import { scrollToId } from '../lib/motion'
import { Logo, SocialIcons } from './ui'

const NAV = [
  { id: 'beneficios', label: 'Benefícios' },
  { id: 'como-funciona', label: 'Como funciona' },
  { id: 'simulador', label: 'Simulador' },
  { id: 'impacto', label: 'Impacto' },
]
const PRODUCTS = ['Tijolo Taquara', 'Placa Taquara', 'Amostra grátis']
const LEGAL = [
  { href: '#termos', label: 'Termos de uso' },
  { href: '#privacidade', label: 'Política de privacidade' },
  { href: '#cookies', label: 'Cookies' },
]
const SOCIAL = [
  { label: 'Instagram', Icon: SocialIcons.Instagram },
  { label: 'LinkedIn', Icon: SocialIcons.LinkedIn },
  { label: 'YouTube', Icon: SocialIcons.YouTube },
]

export default function Footer({ onOpenSample }) {
  const go = (id) => (e) => {
    e.preventDefault()
    scrollToId(id)
  }
  const head = 'font-mono text-[10px] uppercase tracking-[0.2em] text-creme/40'
  const link = 'lift inline-block text-[15px] text-creme/75 hover:text-creme'

  return (
    <footer className="relative mt-6 rounded-t-6xl bg-carvao text-creme">
      <div className="shell pb-10 pt-20 md:pt-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr,1fr,1fr,1fr]">
          <div>
            <Logo light className="h-8" />
            <p className="mt-6 max-w-xs font-drama text-[26px] italic leading-snug text-creme/85">Construindo o futuro a partir da fibra.</p>
            <div className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-creme/10 bg-creme/5 px-4 py-2">
              <span className="pulse-dot h-2 w-2 rounded-full bg-folha text-folha" />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-creme/70">Bambuzal ativo</span>
            </div>
          </div>

          <nav aria-label="Navegação do rodapé">
            <p className={head}>Navegação</p>
            <ul className="mt-5 space-y-3">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} onClick={go(n.id)} className={link}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className={head}>Produtos</p>
            <ul className="mt-5 space-y-3">
              {PRODUCTS.map((p) => (
                <li key={p}>
                  {p === 'Amostra grátis' ? (
                    <button type="button" onClick={onOpenSample} className={`${link} text-left`}>
                      {p}
                    </button>
                  ) : (
                    <a href="#beneficios" onClick={go('beneficios')} className={link}>
                      {p}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={head}>Redes</p>
            <ul className="mt-5 flex gap-2">
              {SOCIAL.map(({ label, Icon }) => (
                <li key={label}>
                  <a href={`#${label.toLowerCase()}`} aria-label={`${label} da Taquara (fictício)`} className="lift grid h-11 w-11 place-items-center rounded-full border border-creme/15 text-creme/75 hover:border-folha hover:text-folha">
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
            <p className={`${head} mt-8`}>Contato</p>
            <p className="mt-3 text-[15px] text-creme/75">contato@taquara.eco</p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-creme/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[11px] text-creme/45">© 2026 Taquara. Projeto acadêmico.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="lift inline-block font-mono text-[11px] text-creme/45 hover:text-creme/80">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
