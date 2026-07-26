import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.jpg'],
      manifest: {
        name: 'Nammude Shabdham',
        short_name: 'Nammude Shabdham',
        description: 'Participatory Governance & Public Accountability Platform',
        theme_color: '#059669',
        background_color: '#f9fafb',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon.jpg',
            sizes: '192x192',
            type: 'image/jpeg',
          },
          {
            src: '/icon.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
          },
        ],
      },
    }),
  ],
})
