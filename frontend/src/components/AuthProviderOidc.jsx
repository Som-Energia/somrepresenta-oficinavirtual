import React, { useState } from 'react'
import useLocalStorage from '@somenergia/somenergia-ui/hooks/LocalStorage'
import { useAuth as useAuthOidc } from 'react-oidc-context'
import ov from '../services/ovapi'
// import { useCookies } from 'react-cookie'

const noFunction = () => undefined

const AuthContext = React.createContext({
  login: noFunction,
  logout: noFunction,
  reloadUser: noFunction,
  currentUser: null,
})

function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('user', null)
  const auth = useAuthOidc()
  const [token, setToken] = useState(null)
  console.log('AUTH en AuthProvider:', auth)

  let currentUser = null
  try {
    currentUser = JSON.parse(user)
  } catch (e) {
    console.error('Parsing user info', e)
  }
  const setCurrentUser = (user) => setUser(JSON.stringify(user))

  const login = React.useCallback(() => {
    console.log('login!')
    auth.signinPopup()
    reloadUser()
  }, [])

  const logout = React.useCallback(() => {
    console.log('logout')
    setCurrentUser(null)
    auth.signoutPopup()
  }, [])

  function error(message) {
    console.error('Auth Error:', message)
    return null
  }

  const reloadUser = React.useCallback(() => {
    console.log('reload user')
    ov.currentUser().then((user) => setCurrentUser(user))
  })

  React.useEffect(() => {
    reloadUser()
  }, [])

  React.useEffect(() => {
    if (!token && auth?.user?.access_token) {
      setToken(auth.user.access_token)
      document.cookie = `Authorization=Bearer ${auth.user.access_token}`
    }
    token && setToken(null)
  }, [auth])

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        currentUser,
        reloadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => React.useContext(AuthContext)

export { AuthProvider, useAuth }
export default AuthProvider
