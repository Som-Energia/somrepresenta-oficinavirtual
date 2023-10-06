import React from 'react'
import useLocalStorage from '../hooks/LocalStorage'
import { useDialog } from './DialogProvider'
import { List, DialogContent, DialogTitle, ListItem, ListItemAvatar, ListItemText, Avatar, ListItemButton } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useCookies } from 'react-cookie';
import { isExpired, decodeToken } from "react-jwt";
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
  const [ cookies] = useCookies(['Authorization'])
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
    window.location = `/oauth2/logout`
  }, [])
  function getCurrentUser() {
    function error(message) {
      console.error("Auth Error:", message)
      return null
    }
    if (cookies.Authorization === undefined) return error("No token found")
    const decodedToken = decodeToken(cookies.Authorization)
    if (decodedToken === null) return error("Bad token")
    if (isExpired(cookies.Authorization)) return error("Expired token")
    return {
      ...decodedToken,
      avatar: decodedToken.picture,
      initials: (
        decodedToken.name
          .split('')
          .filter((l) => l.trim().toUpperCase() === l)
          .slice(0, 2)
          .join('')
      ),

    }
  }
  const currentUser = getCurrentUser()

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
