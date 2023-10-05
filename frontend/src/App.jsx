import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import './i18n/i18n'
import { useTranslation } from 'react-i18next'
import GlobalTheme from './components/GlobalTheme'
import TestPage from './components/TestPage'
import HomePage from './HomePage'
import NotFoundPage from './NotFoundPage'
import NotYetImplementedPage from './NotYetImplementedPage'
import DialogProvider from './components/DialogProvider'
import AuthProvider from './components/AuthProvider'

const routes = [
  {
    path: '*',
    element: <NotFoundPage />,
  },
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/install',
    element: <NotYetImplementedPage />
  },
  {
    path: '/invoices',
    element: <NotYetImplementedPage />
  },
  {
    path: '/production',
    element: <NotYetImplementedPage />
  },
  {
    path: '/test',
    element: <TestPage />
  },
]

const router = createBrowserRouter(routes)

function App() {
  const { t, i18n } = useTranslation()
  const [count, setCount] = React.useState(0)

  return (
    <React.StrictMode>
      <GlobalTheme>
        <DialogProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </DialogProvider>
      </GlobalTheme>
    </React.StrictMode>
  )
}

export default App
