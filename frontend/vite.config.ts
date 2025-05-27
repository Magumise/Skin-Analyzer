import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
    host: '0.0.0.0',
  },
  preview: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  assetsInclude: ['**/*.png'],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  base: '/',
}) 