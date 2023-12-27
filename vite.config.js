import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteyaml from '@modyfi/vite-plugin-yaml'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: '../backend/dist',
  },
  root: 'frontend',
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  plugins: [
    react(),
    viteyaml(),
    svgr(),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:5500',
      '/oauth2': 'http://localhost:5500',
      '/docs': 'http://localhost:5500',
      '/redoc': 'http://localhost:5500',
      '/openapi.json': 'http://localhost:5500',
    },
  },
  test: {
    environment: 'jsdom',
    //setupFiles: ['./src/setupTest.jsx'],
    testMatch: ['./src/**/*.test.jsx'],
    globals: true,
  },
})
