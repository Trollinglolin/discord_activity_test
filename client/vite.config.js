import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  envDir: '../',
  base: '/',
  server: {
    host: true,
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
});
