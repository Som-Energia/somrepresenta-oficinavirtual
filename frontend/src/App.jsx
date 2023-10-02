import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import './i18n/i18n'
import { useTranslation } from 'react-i18next'
import GlobalTheme from './components/GlobalTheme'
import TestPage from './components/TestPage'
import HomePage from './HomePage'
import NotFoundPage from './NotFoundPage'
import DialogProvider from './components/DialogProvider'

const routes = [
  {
    path: '*',
    element: <NotFoundPage />,
  },
  {
    path: '/',
    element: <HomePage />,
  },
]

const router = createBrowserRouter(routes)

function App() {
  const { t, i18n } = useTranslation()
  const [count, setCount] = useState(0)

  return (
    <GlobalTheme>
      <DialogProvider>
        <RouterProvider router={router} />
      </DialogProvider>
    </GlobalTheme>
  )
}

export default App
