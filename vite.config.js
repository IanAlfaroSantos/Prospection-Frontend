import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://prospection-backend-production-fce5.up.railway.app',
        changeOrigin: true,
      }
    }
  }
})
