import React from 'react'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import ov from '../services/ovapi'

// TODO: Let the user inject the specific function
// to actually perform the login and thus removing the
// dependency on ov

function LoginDialog(params) {
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
        if (response.code === 'VALIDATION_ERROR') {
          setError(t('LOGIN.VALIDATION_ERROR'))
          beLoading(false)
          return
        }
        if (response.error){
          setError(t('LOGIN.UNABLE_TO_LOGIN'))
          beLoading(false)
          return
        }
        closeDialog()
      })
  }
  return (
    <>
      <DialogTitle>{t('LOGIN.LOGIN_DIALOG_TITLE')}</DialogTitle>
      <DialogContent sx={{ minWidth: '20rem' }}>
        <form onSubmit={handleSubmit} method="post">
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              name="user"
              label={t('LOGIN.USERNAME_LABEL')}
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
              helperText={t('LOGIN.USERNAME_HELP')}
            />
            <TextField
              name="password"
              label={t('LOGIN.PASSWORD_LABEL')}
              type="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
            <Box color="error.main">{error}</Box>
            <DialogActions>
              <Button onClick={closeDialog}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading || !username || !password}
              >
                {isLoading
                  ? t('LOGIN.SUBMIT_BUTTON_PROCESSING')
                  : t('LOGIN.SUBMIT_BUTTON_LOGIN')}
              </Button>
            </DialogActions>
          </Stack>
        </form>
      </DialogContent>
    </>
  )
}

export default LoginDialog
