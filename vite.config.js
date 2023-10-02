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
  plugins: [react(), ViteYaml(), svgr()],
  server: {
    proxy: {
      '/api': 'http://localhost:5500',
    },
  },
  test: {
    environment: 'jsdom',
    //setupFiles: ['./src/setupTest.jsx'],
    testMatch: ['./src/**/*.test.jsx'],
    globals: true,
  },
})
