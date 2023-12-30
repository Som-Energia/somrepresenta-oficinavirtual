import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteyaml from '@modyfi/vite-plugin-yaml'
import svgr from 'vite-plugin-svgr'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    dedupe: Object.keys(pkg.dependencies),
  },
  build: {
    manifest: true,
    sourcemap: true,
    outDir: '../backend/dist',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return // internal
          return 'vendor'
          let source = id.toString().split('node_modules/')[1].split('/')[0].toString()
          let bigones = [
            'react-i18next',
            '@mui',
            'react-dom',
            'react-router',
            '@remix-run',
            'i18next',
          ]
          if (bigones.includes(source)) return `vendor-${source}`
          //return source // uncomment to split every vendor dependency
          return 'vendor'
        },
      },
    },
  },
  root: 'frontend',
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  plugins: [react(), viteyaml(), svgr()],
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
