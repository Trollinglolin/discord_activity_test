import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  envDir: '../',
  base: mode === 'production' ? '/' : '/',
  build: {
    outDir: '../client/dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url))
      }
    }
  },
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
    hmr: {
      clientPort: 443,
    },
    allowedHosts: [
      'moose-in-adder.ngrok-free.app',
      'trollinglolin.xyz',
      'discord-activity-test-beige.vercel.app',
      'localhost'
    ]
  },
  preview: {
    port: 3000,
    host: true
  }
}));
