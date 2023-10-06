import React from 'react'
import useLocalStorage from '../hooks/LocalStorage'
import { useDialog } from './DialogProvider'
import { List, DialogContent, DialogTitle, ListItem, ListItemAvatar, ListItemText, Avatar, ListItemButton } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import authProviders from '../data/authproviders.yaml'

const noFunction = () => undefined

const AuthContext = React.createContext({
  login: noFunction,
  logout: noFunction,
  currentUser: null,
})

function AuthProviderDialog(params) {
  const {onSelected} = params
  const { t, i18n } = useTranslation()
  return <>
    <DialogContent>
      <DialogTitle>
        {t('APP_FRAME.CHOOSE_AUTH_PROVIDER')}
      </DialogTitle>
      <List>
        {authProviders.map((provider)=> (
          <ListItem
            key={provider.id}
          >
            <ListItemButton onClick={()=>onSelected(provider)}>
              <ListItemAvatar>
                <Avatar src={provider.logo} alt={provider.initials}>{provider.avatar?null:provider.initials}</Avatar>
              </ListItemAvatar>
              <ListItemText
              >
                {provider.name}
              </ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </DialogContent>
  </>
}

function AuthProvider({children}) {
  const [user, setUser] = useLocalStorage('user', null)
  const [openDialog, closeDialog] = useDialog()

  const login = React.useCallback(()=>{
    openDialog({
      children: <AuthProviderDialog onSelected={(provider) =>{
        window.location = `/oauth2/${provider.id}/authorize`
      }}
    />})
  }, [])

  const logout = React.useCallback(()=>{
    setUser(null)
  }, [])

  var currentUser = null
  try {
    currentUser = JSON.parse(user)
  } catch (e) {
    console.error("Invalid user info content")
    setUser(null)
  }

  console.log({user})
  return <AuthContext.Provider value={{
    login,
    logout,
    currentUser,
  }}>
    {children}
  </AuthContext.Provider>
}

export { AuthContext }
export default AuthProvider
