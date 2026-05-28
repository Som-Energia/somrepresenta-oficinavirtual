import { createAppConfig } from "@somenergia/frontend-config/vite"

import viteyaml from "@modyfi/vite-plugin-yaml"
import react from "@vitejs/plugin-react"
import eslint from "vite-plugin-eslint2"
import svgr from "vite-plugin-svgr"

import pkg from "./package.json"

export default createAppConfig(({ mode }) => {
  return {
    resolve: {
      dedupe: Object.keys(pkg.dependencies),
    },
    build: {
      manifest: true,
      sourcemap: mode === "development",
      outDir: "../backend/dist",
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (!id.includes("node_modules") || id.includes("@types")) {
              return
            }

            const pkg = id.match(
              /node_modules\/([^/@][^/]*|@[^/]+\/[^/]+)/,
            )?.[1]

            if (["react", "react-dom", "scheduler"].includes(pkg)) {
              return "react-vendor"
            }

            if (
              pkg?.startsWith("@emotion") ||
              pkg === "stylis" ||
              pkg === "styled-components"
            ) {
              return "emotion-vendor"
            }

            if (pkg?.startsWith("@mui")) {
              return "mui-vendor"
            }

            if (
              [
                "react-router-dom",
                "react-router",
                "@remix-run/router",
                "react-oidc-context",
                "oidc-client-ts",
              ].includes(pkg)
            ) {
              return "react-route-vendor"
            }

            if (
              [
                "i18next",
                "react-i18next",
                "i18next-browser-languagedetector",
              ].includes(pkg)
            ) {
              return "i18n-vendor"
            }

            if (pkg === "axios") {
              return "axios-vendor"
            }

            if (pkg === "lodash" || pkg === "lodash-es") {
              return "lodash-vendor"
            }

            if (pkg?.startsWith("@popperjs")) {
              return "popperjs-vendor"
            }

            if (pkg === "recharts") {
              return "recharts"
            }

            if (pkg === "@mui/x-date-pickers" || pkg === "dayjs") {
              return "date-pickers-vendor"
            }

            if (
              pkg?.startsWith("d3") ||
              ["internmap", "delaunator", "robust-predicates"].includes(pkg)
            ) {
              return "d3-vendor"
            }

            if (pkg?.startsWith("@somenergia")) {
              return "somenergia-vendor"
            }

            if (
              [
                "papaparse",
                "react-csv",
                "react-cookie",
                "react-jwt",
                "react-confetti-explosion",
                "mui-markdown",
              ].includes(pkg)
            ) {
              return "misc-vendor"
            }

            return "vendor"
          },
        },
      },
    },
    root: "frontend",
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    plugins: [
      react(),
      viteyaml(),
      svgr(),
      eslint({
        build: true,
        lintOnStart: true,
        include: ["frontend/src/**/*.{js,jsx,ts,tsx}"],
      }),
    ],
    server: {
      proxy: {
        "/api": "http://localhost:5500",
        "/oauth2": "http://localhost:5500",
        "/docs": "http://localhost:5500",
        "/redoc": "http://localhost:5500",
        "/openapi.json": "http://localhost:5500",
      },
    },
    test: {
      exclude: ["**/node_modules/**"],
      testMatch: ["./src/**/*.test.jsx"],
      server: {
        deps: {
          // Pre-bundle MUI and somenergia-ui to avoid ES module directory import errors
          inline: [
            /@mui\/material/,
            /@mui\/icons-material/,
            "@mui/x-date-pickers",
            /@somenergia\/somenergia-ui/,
          ],
        },
      },
    },
  }
})
