import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    outDir: 'dist'
  },
  server: {
    port: 3000,
    proxy: {
      '/api/prices': {
        target: 'https://api.coingecko.com/api/v3/coins/markets',
        changeOrigin: true,
        rewrite: () => '',
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Add query parameters to the request
            proxyReq.path += '?vs_currency=usd&ids=ethereum,bitcoin&price_change_percentage=24h';
          });
          proxy.on('error', (err, _req, _res) => {
            console.error('proxy error', err);
          });
        }
      }
    }
  }
})

