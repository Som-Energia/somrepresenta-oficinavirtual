import {
  createAppConfig,
  createManualChunks,
} from '@somenergia/frontend-config/vite'

import viteyaml from '@modyfi/vite-plugin-yaml'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

import pkg from './package.json'

export default createAppConfig(() => {
  return {
    resolve: {
      dedupe: Object.keys(pkg.dependencies),
    },
    build: {
      manifest: true,
      sourcemap: true,
      outDir: '../backend/dist',
      rollupOptions: {
        output: {
          manualChunks: createManualChunks(),
        },
      },
    },
    root: 'frontend',
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    plugins: [
      react(),
      viteyaml(),
      svgr(),
      // eslint({
      //   build: true,
      //   lintOnStart: true,
      //  include: ['frontend/src/**/*.{js,jsx,ts,tsx}'],
      // }),
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
      exclude: ['**/node_modules/**'],
      testMatch: ['./src/**/*.test.jsx'],
      server: {
        deps: {
          // Pre-bundle MUI and somenergia-ui to avoid ES module directory import errors
          inline: [
            /@mui\/material/,
            /@mui\/icons-material/,
            '@mui/x-date-pickers',
            /@somenergia\/somenergia-ui/,
          ],
        },
      },
    },
  }
})
