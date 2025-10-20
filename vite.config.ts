import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [],
      manifest: {
        name: 'Trash-Talk Chess',
        short_name: 'TTC',
        description: 'Chess with voice trash-talk',
        theme_color: '#111827',
        background_color: '#111827',
        display: 'standalone',
        icons: [],
      },
    }),
  ],
  test: {
    environment: 'node',
    setupFiles: [],
  },
})
