import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // The staging API doesn't send Access-Control-Allow-Origin, so the browser
    // blocks direct cross-origin calls. Proxying through the dev server avoids
    // that: the browser only ever talks to same-origin /api, and Vite forwards
    // the request server-side, where CORS doesn't apply. See api/client.ts.
    proxy: {
      '/api': {
        target: 'https://admin-moderator-backend-staging.up.railway.app',
        changeOrigin: true,
      },
    },
  },
})
