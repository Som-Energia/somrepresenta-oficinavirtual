import React from 'react'
import axios from 'axios'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Avatar from '@mui/material/Avatar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import { useTranslation } from 'react-i18next'
import useLocalStorage from '../hooks/LocalStorage'
import { useDialog } from './DialogProvider'
import HijackDialog from './HijackDialog'
import ov from '../services/ovapi'
import authProviders from '../data/authproviders.yaml'

const noFunction = () => undefined

const AuthContext = React.createContext({
  login: noFunction,
  logout: noFunction,
  hijack: noFunction,
  reloadUser: noFunction,
  currentUser: null,
})

function AuthProviderDialog(params) {
  const { onSelected } = params
  const { t, i18n } = useTranslation()
  return (
    <>
      <DialogContent>
        <DialogTitle>{t('APP_FRAME.CHOOSE_AUTH_PROVIDER')}</DialogTitle>
        <List>
          {authProviders.map((provider) => (
            <ListItem key={provider.id}>
              <ListItemButton onClick={() => onSelected(provider)}>
                <ListItemAvatar>
                  <Avatar src={provider.logo} alt={provider.initials}>
                    {provider.avatar ? null : provider.initials}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText>{provider.name}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </>
  )
}

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

  const login = React.useCallback(() => {
    openDialog({
      children: (
        <AuthProviderDialog
          onSelected={(provider) => {
            ov.externalLogin(provider.id)
          }}
        />
      ),
    })
  }, [])

  const logout = React.useCallback(() => {
    setCurrentUser(null)
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

  function error(message) {
    console.error('Auth Error:', message)
    return null
  }

  const reloadUser = React.useCallback(() => {
    ov.currentUser().then((user) => setCurrentUser(user))
  })

  React.useEffect(() => {
    reloadUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        hijack,
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
