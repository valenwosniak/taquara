// Fotos do Unsplash (licença Unsplash). Se alguma falhar, <SmartImage> mostra um degradê da paleta.
const u = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`

export const IMAGES = {
  // Bambuzal visto de baixo — Isaac Garcia
  hero: { src: u('1714758461816-9f3b9fc81a81', 2200), alt: 'Bambuzal visto de baixo, com colmos altos se encontrando contra o céu' },
  // Teto de bambu — Daniela Paola Alchapar
  manifesto: { src: u('1642781125655-7f10240cad94', 1800), alt: '' },
  // Colmo de bambu verde em foco suave — Volodymyr Leush
  stalk: { src: u('1761311554695-68cfca1f3140', 1200), alt: 'Colmo de bambu verde com nó e folhas em foco suave' },
  // Fibras naturais trançadas
  fiber: { src: u('1750710606768-d69cad92080b', 1200), alt: 'Textura de fibras naturais trançadas em tons de palha' },
  // Tijolos empilhados — Mufid Majnun
  bricks: { src: u('1632758821813-eb8248651745', 1200), alt: 'Tijolos de terra empilhados lado a lado' },
  // Arquitetura contemporânea integrada à vegetação
  house: { src: u('1600585154340-be6161a56a0c', 1400), alt: 'Casa contemporânea com grandes janelas cercada por árvores ao entardecer' },
}

export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
