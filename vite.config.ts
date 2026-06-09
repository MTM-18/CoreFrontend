import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    proxy: {
      // API from cPanel
      "/api": {
        target: "https://corebhub.com",
        changeOrigin: true,
        secure: true,
      },
      // Images uploaded in cPanel
      "/uploads": {
        target: "https://corebhub.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
