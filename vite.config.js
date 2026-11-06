import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Base configurável para o GitHub Pages.
// - Em dev (npm run dev), o site roda na raiz ("/").
// - No build e no preview, usa BASE_PATH (ex.: BASE_PATH=/meu-repo/ npm run build).
//   Padrão: "/taquara/" (nome do repositório no GitHub).
const BASE = process.env.BASE_PATH || '/taquara/'

export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? BASE : '/',
  plugins: [react()],
}))
