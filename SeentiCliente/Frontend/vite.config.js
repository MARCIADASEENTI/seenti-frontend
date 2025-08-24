// vite.config.js
//08072025
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  resolve: {
    alias: {
      '@white': path.resolve(__dirname, 'src/whiteLabel'),
    },
  },
});