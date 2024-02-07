import React from 'react'
import {
  createHashRouter as createRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from 'react-router-dom'
import './App.css'
import i18n from './i18n/i18n'
import { useTranslation } from 'react-i18next'
import { CookiesProvider } from 'react-cookie'
import GlobalTheme from './components/GlobalTheme'
import TestPage from './components/TestPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './NotFoundPage'
import DialogProvider from './components/DialogProvider'
import AuthProvider from './components/AuthProvider'
import PageGuard from './components/PageGuard'
import TermsCheck from './components/TermsCheck'
import VersionCheck from './components/VersionCheck'
import AppFrame from './components/AppFrame'
import BreakPointIndicator from './components/BreakPointIndicator'
import SnackbarMessages from './components/SnackbarMessages'
import HijackWarning from './components/HijackWarning'
import CookiesBanner from './components/CookiesBanner'
import ProfilePage from './pages/ProfilePage'
import InstallationsPage from './pages/InstallationsPage'
import DetailInstallationPage from './pages/DetailInstallationPage'
import InvoicesPage from './pages/InvoicesPage'
import ProductionPage from './pages/ProductionPage'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { InstallationContextProvider } from './components/InstallationProvider'

const routes = [
  {
    element: (
      <GlobalTheme>
        <CookiesBanner />
        <DialogProvider>
          <VersionCheck />
          <CookiesProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
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
        path: '*',
        element: <NotFoundPage />,
      },
      {
        path: '/test',
        element: <TestPage />,
      },
      {
        path: '/',
        element: <HomePage />,
      },
      {
        element: (
          <PageGuard>
            <Outlet />
          </PageGuard>
        ),
        children: [
          {
            path: '/profile',
            element: <ProfilePage />,
          },
          {
            path: '/installation',
            element: (
              <InstallationContextProvider>
                <Outlet />
              </InstallationContextProvider>
            ),
            children: [
              {
                path: '',
                element: <InstallationsPage />,
              },
              {
                path: ':contract_number',
                element: <DetailInstallationPage />,
              },
            ],
          },
          {
            path: '/invoices',
            element: <InvoicesPage />,
          },
          {
            path: '/production',
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
  const { t, i18n } = useTranslation()
  const [count, setCount] = React.useState(0)

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}

export default App
