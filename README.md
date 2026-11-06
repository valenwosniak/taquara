# Taquara

**Construindo o futuro a partir da fibra.**

Landing page do protótipo da Taquara, startup (projeto acadêmico) que transforma a fibra do bambu em tijolos e placas para construir com menos carbono.

Stack: Vite + React 19, Tailwind CSS 3.4.17, GSAP 3 (ScrollTrigger + CustomEase) e Lucide React.

## Rodando localmente

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build e GitHub Pages

O `base` do Vite é configurável pela variável `BASE_PATH` (padrão: `/taquara/`).

```bash
npm run build                      # gera dist/ com base /taquara/
BASE_PATH=/outro-repo/ npm run build
npm run build:root                 # base "/" (domínio próprio)
npm run preview                    # testa o build em http://localhost:4173/taquara/
```

Há duas formas de publicar:

1. **GitHub Actions (recomendado):** o workflow `.github/workflows/deploy.yml` publica a cada push na `main`, usando o nome do repositório como base. No GitHub, vá em *Settings → Pages → Source: GitHub Actions*.
2. **Manual:** `npm run deploy` publica `dist/` na branch `gh-pages` (pacote `gh-pages`). Em *Settings → Pages*, escolha a branch `gh-pages`.

## Estrutura

```
src/
  App.jsx                    composição das seções, ruído global e modal
  index.css                  Tailwind, overlay de ruído, botões magnéticos e utilitários
  lib/motion.js              registro do GSAP, easing "spring", reduced motion
  lib/images.js              URLs do Unsplash e helper de assets com base
  components/
    BambooProgress.jsx       assinatura: bambu fixo que cresce com o scroll
    Navbar.jsx               "ilha flutuante"
    Hero.jsx                 hero + broto que nasce no carregamento
    Benefits.jsx             Shuffler, Typewriter e Cursor Scheduler
    Manifesto.jsx            revelação palavra por palavra
    Impact.jsx               o número 17, indicadores e comparativo
    HowItWorks.jsx           cards empilhados com pin
    Simulator.jsx            simulador (parâmetros no topo do arquivo)
    CallToAction.jsx         "Sua próxima obra pode crescer."
    SampleModal.jsx          formulário de amostra grátis (simulado)
    Footer.jsx
    ui.jsx                   botão magnético, imagem com fallback, logo
public/
  logo-taquara.png           logo original
  logo-taquara-clean.png     logo recortada com fundo transparente (usada no site)
  favicon-*.png, favicon.ico gerados a partir do símbolo
```

## Ajustando o simulador

Todos os parâmetros de cálculo ficam em constantes comentadas no topo de `src/components/Simulator.jsx`: tijolos por m² (64), área da placa, margem de perda, faixa de economia (20% a 40%), custo de referência por m², produtividade e emissões de referência. Os valores são estimativas para fins de demonstração.

## O bambu de progresso

`BambooProgress.jsx` cria um segmento para cada elemento com o atributo `data-bamboo` (7 seções). Cada segmento cresce com `scaleY` amarrado ao scroll (`scrub: true`). Ao completar, o nó dá um "pop" e uma folha brota com easing de mola. Na seção de CTA o colmo chega ao topo e abre a folha final. Com `prefers-reduced-motion`, o bambu já aparece crescido.

## Créditos das imagens

Fotos do [Unsplash](https://unsplash.com) (Licença Unsplash): Isaac Garcia (bambuzal), Volodymyr Leush (colmo), Daniela Paola Alchapar (teto de bambu), Mufid Majnun (tijolos) e demais autores das texturas e da arquitetura.

© 2026 Taquara. Projeto acadêmico.
