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
import users from '../data/dummyusers.yaml'

const noFunction = () => undefined

const AuthContext = React.createContext({
  login: noFunction,
  logout: noFunction,
  currentUser: null,
})

function DummyAuthDialog(params) {
  const { onUserSelected } = params
  const { t, i18n } = useTranslation()
  return (
    <>
      <DialogContent>
        <DialogTitle>{t('APP_FRAME.CHOOSE_USER')}</DialogTitle>
        <List>
          {users.map((user) => (
            <ListItem key={user.id}>
              <ListItemButton onClick={() => onUserSelected(user)}>
                <ListItemAvatar>
                  <Avatar src={user.avatar} alt={user.initials}>
                    {user.avatar ? null : user.initials}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.name} secondary={user.email}></ListItemText>
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

  const login = React.useCallback(() => {
    openDialog({
      children: (
        <DummyAuthDialog
          onUserSelected={(user) => {
            setUser(JSON.stringify(user))
            closeDialog()
          }}
        />
      ),
    })
  }, [])

  const logout = React.useCallback(() => {
    setUser(null)
  }, [])

  var currentUser = null
  try {
    currentUser = JSON.parse(user)
  } catch (e) {
    console.error('Invalid user info content')
    setUser(null)
  }

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

const useAuth = () => React.useContext(AuthContext)

export { AuthProvider, useAuth }
export default AuthProvider
