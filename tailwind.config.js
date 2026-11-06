/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        taquara: { DEFAULT: '#2F5D3A', deep: '#24492D', light: '#3E7A4C' }, // Verde Taquara (primary)
        terracota: { DEFAULT: '#C9622F', dark: '#A94F23' }, // Accent
        folha: { DEFAULT: '#8BB653', dark: '#6F9A3E' }, // Secondary (crescimento)
        argila: '#E0893F', // Laranja Argila (uso pontual)
        creme: { DEFAULT: '#F7F3E8', dark: '#EDE6D3' }, // Background
        carvao: { DEFAULT: '#16211A', soft: '#1F2D24' }, // Texto e seções escuras
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'system-ui', 'sans-serif'],
        drama: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
        '6xl': '4rem',
      },
      boxShadow: {
        card: '0 1px 0 rgba(22,33,26,0.04), 0 24px 48px -24px rgba(22,33,26,0.28)',
        lift: '0 2px 0 rgba(22,33,26,0.05), 0 32px 64px -28px rgba(22,33,26,0.4)',
        phone: '0 40px 80px -30px rgba(22,33,26,0.55), 0 0 0 1px rgba(22,33,26,0.08)',
        glow: '0 0 0 6px rgba(139,182,83,0.18)',
      },
      transitionTimingFunction: {
        magnetic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
    },
  },
  plugins: [],
}
