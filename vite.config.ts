import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';
// https://vitejs.dev/config/

const {parsed} = dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: 1503,
    host: '0.0.0.0'
  },
  envPrefix:'MGST',
  define: {
    'process.env': parsed
  },
  resolve: {
    alias: {
      views: '/src/views',
      components: '/src/components',
      hooks: '/src/hooks',
      routers: '/src/routers'
    }
  }
})
