import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'frontend',          // tell Vite to use frontend as root
  build: {
    outDir: '../dist',       // output folder relative to project root
  },
  server: {
    port: 5173,              // default dev port, can change if needed
  },
})
