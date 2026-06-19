import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("three") || id.includes("react-globe.gl") || id.includes("three-globe")) {
            return "globe-vendor";
          }
          if (id.includes("pdfjs-dist") || id.includes("xlsx")) {
            return "cms-tools";
          }
          if (/[\\/]node_modules[\\/](react|react-dom|react-router-dom|scheduler)[\\/]/.test(id)) {
            return "react-vendor";
          }
        },
      },
    },
  },
  server: {
    proxy: {
      // API from cPanel
      "/api": {
        target: "https://corebhub.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
