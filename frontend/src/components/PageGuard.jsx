import React from 'react'
import { useAuth } from './AuthProvider'
import AppFrame from './AppFrame'

function NotAuthenticated() {
  return (
    <AppFrame>
      <h1>Not Authenticated</h1>
    </AppFrame>
  )
}

function PageGuard(params) {
  const {children} = params
  const {currentUser, login, logout} = useAuth()
  if (currentUser===null) return <NotAuthenticated/>
  return (<>{children}</>)
}

export default PageGuard