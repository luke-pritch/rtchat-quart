import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  server: {
    port: 3000,
  },
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5001',
          changeOrigin: true,
        },
        '/ws': {
          target: 'ws://localhost:5001',
          ws: true,
          changeOrigin: true,
        },
      },
    },
  },
});