import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from 'tailwindcss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    open: true,
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
})
