import React from 'react'
import axios from 'axios'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import useLocalStorage from '../hooks/LocalStorage'
import { useDialog } from './DialogProvider'
import authProviders from '../data/authproviders.yaml'
import ov from '../services/ovapi'

const noFunction = () => undefined

const AuthContext = React.createContext({
  login: noFunction,
  logout: noFunction,
  currentUser: null,
})

function AuthProviderDialog(params) {
  const { closeDialog } = params
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, beLoading] = React.useState(false)
  const [error, setError] = React.useState()
  const { t, i18n } = useTranslation()
  async function handleSubmit(ev) {
    ev.preventDefault()
    beLoading(true)
    ov.localLogin(username, password)
      .then((response) => {
        console.log(response)
        closeDialog()
      })
      .catch((error) => {
        console.error({ error })
        setError('Usuario o contraseña invàlida.')
        beLoading(false)
      })
  }
  return (
    <>
      <DialogContent>
        <DialogTitle>{t('APP_FRAME.LOGIN_DIALOG_TITLE')}</DialogTitle>
        <form onSubmit={handleSubmit} method="post">
          <Stack spacing={3}>
            <TextField
              name="user"
              label={t('APP_FRAME.LABEL_USERNAME')}
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
              helperText="lala"
            />
            <TextField
              name="password"
              label={t('APP_FRAME.LABEL_PASSWORD')}
              type="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
            <Button disabled={isLoading || !username || !password} type="submit">
              {isLoading
                ? t('APP_FRAME.SUBMIT_BUTTON_PROCESSING')
                : t('APP_FRAME.SUBMIT_BUTTON_LOGIN')}
            </Button>
            <Box color="error.main">{error}</Box>
          </Stack>
        </form>
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
  const updateUser = () => {
    ov.currentUser().then((user) => setCurrentUser(user))
  }

  const login = React.useCallback(() => {
    openDialog({
      children: (
        <AuthProviderDialog
          closeDialog={() => {
            closeDialog()
            updateUser()
          }}
        />
      ),
    })
  }, [])

  const logout = React.useCallback(() => {
    setUser(null)
    ov.logout()
  }, [])

  function error(message) {
    console.error('Auth Error:', message)
    return null
  }

  React.useEffect(() => {
    updateUser()
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

const useAuth = () => React.useContext(AuthContext)

export { AuthProvider, useAuth }
export default AuthProvider
