import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: '/static/frontend/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})