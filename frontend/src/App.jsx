import "./App.css"
import "dayjs/locale/ca"
import "dayjs/locale/es"
import "dayjs/locale/eu"
import "dayjs/locale/gl"

import React from "react"
import { CookiesProvider } from "react-cookie"
import {
  createHashRouter as createRouter,
  Outlet,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom"

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"

import AppFrame from "./components/AppFrame"
import AuthProvider from "./components/AuthProvider"
import BreakPointIndicator from "./components/BreakPointIndicator"
import CookiesBanner from "./components/CookiesBanner"
import DialogProvider from "./components/DialogProvider"
import GlobalTheme from "./components/GlobalTheme"
import HijackWarning from "./components/HijackWarning"
import { InstallationContextProvider } from "./components/InstallationProvider"
import PageGuard from "./components/PageGuard"
import SnackbarMessages from "./components/SnackbarMessages"
import TermsCheck from "./components/TermsCheck"
import TestPage from "./components/TestPage"
import VersionCheck from "./components/VersionCheck"
import i18n from "./i18n/i18n"
import NotFoundPage from "./NotFoundPage"
import CookiesPolicyPage from "./pages/CookiesPolicyPage"
import DetailInstallationPage from "./pages/DetailInstallationPage"
import HomePage from "./pages/HomePage"
import InstallationsPage from "./pages/InstallationsPage"
import InvoicesPage from "./pages/InvoicesPage"
import ProductionPage from "./pages/ProductionPage"
import ProfilePage from "./pages/ProfilePage"

const routes = [
  {
    element: (
      <GlobalTheme>
        <CookiesBanner />
        <DialogProvider>
          <VersionCheck />
          <CookiesProvider>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={i18n.language}>
              <AuthProvider>
                <ScrollRestoration /> {/* Scroll up on page switch */}
                <BreakPointIndicator />
                <SnackbarMessages variant="filled" />
                <HijackWarning />
                <AppFrame>
                  <TermsCheck />
                  <Outlet />
                </AppFrame>
              </AuthProvider>
            </LocalizationProvider>
          </CookiesProvider>
        </DialogProvider>
      </GlobalTheme>
    ),
    children: [
      {
        path: "*",
        element: <NotFoundPage />,
      },
      {
        path: "/test",
        element: <TestPage />,
      },
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/cookies_policy",
        element: <CookiesPolicyPage />,
      },
      {
        element: (
          <PageGuard>
            <Outlet />
          </PageGuard>
        ),
        children: [
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            path: "/installation",
            element: (
              <InstallationContextProvider>
                <Outlet />
              </InstallationContextProvider>
            ),
            children: [
              {
                path: "",
                element: <InstallationsPage />,
              },
              {
                path: ":contract_number",
                element: <DetailInstallationPage />,
              },
            ],
          },
          {
            path: "/invoices",
            element: <InvoicesPage />,
          },
          {
            path: "/production",
            element: (
              <InstallationContextProvider>
                <ProductionPage />
              </InstallationContextProvider>
            ),
          },
        ],
      },
    ],
  },
]

const router = createRouter(routes)

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}

export default App
