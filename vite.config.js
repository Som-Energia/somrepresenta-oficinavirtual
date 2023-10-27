import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ViteYaml from '@modyfi/vite-plugin-yaml'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: '../backend/dist',
  },
  root: 'frontend',
  define: {
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
  },
  plugins: [react(), ViteYaml(), svgr()],
  server: {
    proxy: {
      '/api': 'http://localhost:5500',
      '/oauth2': 'http://localhost:5500',
      '/docs': 'http://localhost:5500',
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
