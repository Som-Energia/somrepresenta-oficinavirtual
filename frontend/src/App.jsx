import React from 'react'
import {
  createHashRouter as createRouter,
  RouterProvider,
  Outlet,
} from 'react-router-dom'
import './App.css'
import './i18n/i18n'
import { useTranslation } from 'react-i18next'
import { CookiesProvider } from 'react-cookie'
import GlobalTheme from './components/GlobalTheme'
import TestPage from './components/TestPage'
import HomePage from './HomePage'
import NotFoundPage from './NotFoundPage'
import NotYetImplementedPage from './NotYetImplementedPage'
import DialogProvider from './components/DialogProvider'
import AuthProvider from './components/AuthProvider'
import PageGuard from './components/PageGuard'
import AppFrame from './components/AppFrame'
import ProfilePage from './ProfilePage'

const routes = [
  {
    element: (
      <GlobalTheme>
        <DialogProvider>
          <CookiesProvider>
            <AuthProvider>
              <AppFrame>
                <Outlet />
              </AppFrame>
            </AuthProvider>
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
            path: '/install',
            element: <NotYetImplementedPage />,
          },
          {
            path: '/invoices',
            element: <NotYetImplementedPage />,
          },
          {
            path: '/production',
            element: <NotYetImplementedPage />,
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
