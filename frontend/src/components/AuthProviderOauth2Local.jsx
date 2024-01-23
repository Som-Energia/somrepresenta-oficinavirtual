import React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { useTranslation } from 'react-i18next'
import useLocalStorage from '../hooks/LocalStorage'
import { useDialog } from './DialogProvider'
import ov from '../services/ovapi'
import wait from '../services/wait'
import ChangePasswordDialog from './ChangePasswordDialog'
import LoginDialog from './LoginDialog'
import HijackDialog from './HijackDialog'

const noFunction = () => undefined

const AuthContext = React.createContext({
  login: noFunction,
  logout: noFunction,
  hijack: noFunction,
  reloadUser: noFunction,
  currentUser: null,
})

function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('user', null)
  const [openDialog, closeDialog] = useDialog()

  let currentUser = null
  try {
    currentUser = JSON.parse(user)
  } catch (e) {
    console.error('Parsing user info', e)
  }
  const setCurrentUser = (user) => setUser(JSON.stringify(user))
  const reloadUser = () => {
    ov.currentUser().then((user) => setCurrentUser(user))
  }

  const login = React.useCallback(() => {
    openDialog({
      children: (
        <LoginDialog
          closeDialog={() => {
            closeDialog()
            reloadUser()
          }}
        />
      ),
    })
  }, [])

  const logout = React.useCallback(() => {
    setUser(null)
    ov.logout()
  }, [])

  const hijack = React.useCallback(() => {
    openDialog({
      children: (
        <HijackDialog
          closeDialog={() => {
            closeDialog()
            reloadUser()
          }}
        />
      ),
    })
  }, [])

  const changePassword = React.useCallback(() => {
    openDialog({
      children: (
        <ChangePasswordDialog
          closeDialog={() => {
            closeDialog()
          }}
        />
      ),
    })
  }, [])

  function error(message) {
    console.error('Auth Error:', message)
    return null
  }

  React.useEffect(() => {
    reloadUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        reloadUser,
        currentUser,
        changePassword,
        hijack,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => React.useContext(AuthContext)

export { AuthProvider, useAuth }
export default AuthProvider
