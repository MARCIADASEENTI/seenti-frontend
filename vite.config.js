// vite.config.js
//08072025 - Otimizado para Sprint 08
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    open: false, // Não abrir navegador automaticamente
    cors: true, // Habilitar CORS para desenvolvimento
  },
  resolve: {
    alias: {
      '@white': path.resolve(__dirname, 'src/whiteLabel'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Desabilitar sourcemaps em produção
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});