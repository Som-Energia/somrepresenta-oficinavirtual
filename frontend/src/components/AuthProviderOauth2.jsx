import React from 'react'
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
import authProviders from '../data/authproviders.yaml'

const noFunction = () => undefined

const AuthContext = React.createContext({
  login: noFunction,
  logout: noFunction,
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
  }
  catch(e) {
    console.error('Parsing user info', e)
  }
  const setCurrentUser = (user) => setUser(JSON.stringify(user))

  const login = React.useCallback(() => {
    openDialog({
      children: (
        <AuthProviderDialog
          onSelected={(provider) => {
            window.location = `/oauth2/${provider.id}/authorize`
          }}
        />
      ),
    })
  }, [])

  const logout = React.useCallback(() => {
    setCurrentUser(null)
    window.location = `/oauth2/logout`
  }, [])

  function error(message) {
    console.error('Auth Error:', message)
    return null
  }

  React.useEffect(() => {
    const fetchCurrentUser = async () => {
      const response = await fetch('/api/me')
      if (response.ok === false) {
        const error = await response.json()
        console.error("Login status:", error.detail)
        return null
      }
      const user = await response.json()
      return user
    }
    fetchCurrentUser().then((user) => setCurrentUser(user))
  }, [])

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
export default AuthProvider
