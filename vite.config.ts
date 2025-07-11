import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // <- 👈 important part to allow access from other devices
    port: 5173,       // <- optional: can be any port you prefer
  },
})
