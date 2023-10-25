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
              label={t('APP_FRAME.USERNAME_LABEL')}
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
              helperText={t('APP_FRAME.USERNAME_HELP')}
            />
            <TextField
              name="password"
              label={t('APP_FRAME.PASSWORD_LABEL')}
              type="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
            <Box color="error.main">{error}</Box>
            <Button disabled={isLoading || !username || !password} type="submit">
              {isLoading
                ? t('APP_FRAME.SUBMIT_BUTTON_PROCESSING')
                : t('APP_FRAME.SUBMIT_BUTTON_LOGIN')}
            </Button>
          </Stack>
        </form>
      </DialogContent>
    </>
  )
}

function ChangePasswordDialog(params) {
  const { closeDialog, username } = params
  const [currentPassword, setCurrentPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [checkPassword, setCheckPassword] = React.useState('')
  const [error, setError] = React.useState()
  const [isLoading, beLoading] = React.useState(false)
  const { t, i18n } = useTranslation()
  async function handleSubmit(ev) {
    ev.preventDefault()
  }

  return (
    <>
      <DialogContent>
        <DialogTitle>{t('APP_FRAME.CHANGE_PASSWORD_DIALOG_TITLE')}</DialogTitle>
        <form onSubmit={handleSubmit} method="post">
          <Stack spacing={3}>
            <TextField
              name="currentPassword"
              label={t('APP_FRAME.CURRENT_PASSWORD_LABEL')}
              type="password"
              value={currentPassword}
              onChange={(ev) => setCurrentPassword(ev.target.value)}
            />
            <TextField
              name="newPassword"
              label={t('APP_FRAME.NEW_PASSWORD_LABEL')}
              type="password"
              value={newPassword}
              onChange={(ev) => setNewPassword(ev.target.value)}
            />
            <TextField
              name="checkPassword"
              label={t('APP_FRAME.CHECK_PASSWORD_LABEL')}
              type="password"
              value={checkPassword}
              onChange={(ev) => setCheckPassword(ev.target.value)}
              error={checkPassword !== '' && checkPassword !== newPassword}
              helperText={
                checkPassword !== '' && checkPassword !== newPassword
                  ? t('APP_FRAME.NEW_PASSWORD_MISSMATCH_ERROR')
                  : ' ' // To avoid relayout when no error
              }
            />
            <Box color="error.main">{error}</Box>
            <Button
              disabled={isLoading || !currentPassword || !newPassword || !checkPassword}
              type="submit"
            >
              {isLoading
                ? t('APP_FRAME.SUBMIT_BUTTON_PROCESSING')
                : t('APP_FRAME.SUBMIT_BUTTON_CHANGE_PASSWORD')}
            </Button>
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

  const changePassword = React.useCallback(() => {
    openDialog({
      children: <ChangePasswordDialog />,
    })
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
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => React.useContext(AuthContext)

export { AuthProvider, useAuth }
export default AuthProvider
