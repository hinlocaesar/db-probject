import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * The site is published to GitHub Pages from the `gh-pages` branch, which
 * serves it from https://<user>.github.io/<repo>/ — a subpath, not a domain
 * root. Every asset URL Vite writes has to carry that prefix, so `base` is
 * set from the environment at build time.
 *
 * Local development keeps `base: '/'` so http://localhost:5173 works
 * normally; only the deploy build sets it.
 */
const isPagesDeploy = process.env.GITHUB_ACTIONS === 'true'

export default defineConfig({
  base: isPagesDeploy ? '/db-probject/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: true,
  },
})