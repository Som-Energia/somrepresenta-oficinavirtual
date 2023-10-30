import React from 'react'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import { useTranslation } from 'react-i18next'
import ov from '../services/ovapi'
import wait from '../services/wait'

// TODO: Let the user inject the specific function
// to actually perform the action and thus removing the
// dependency on ov

function ChangePasswordDialog(params) {
  const { closeDialog } = params
  const [currentPassword, setCurrentPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [checkPassword, setCheckPassword] = React.useState('')
  const [error, setError] = React.useState()
  const [isLoading, beLoading] = React.useState(false)
  const [isSuccess, beSuccess] = React.useState(false)
  const { t, i18n } = useTranslation()

  async function handleSubmit(ev) {
    ev.preventDefault()
    setError(undefined)
    beLoading(true)
    beSuccess(false)
    try {
      const result = await ov.localChangePassword(currentPassword, newPassword)
      beLoading(false)
      beSuccess(true)
      wait(1000).then(() => closeDialog())
    } catch (error) {
      setError(t('CHANGE_PASSWORD.CURRENT_PASSWORD_MISSMATCH_ERROR'))
      beLoading(false)
    }
  }
  const newPasswordError =
    newPassword === ''
      ? undefined
      : newPassword === currentPassword
      ? t('CHANGE_PASSWORD.NEW_PASSWORD_SAME_AS_CURRENT_ERROR')
      : !/[a-z]/.test(newPassword)
      ? t('CHANGE_PASSWORD.NEW_PASSWORD_MUST_CONTAIN_LOWERCASE')
      : !/[A-Z]/.test(newPassword)
      ? t('CHANGE_PASSWORD.NEW_PASSWORD_MUST_CONTAIN_UPPERCASE')
      : !/\d/.test(newPassword)
      ? t('CHANGE_PASSWORD.NEW_PASSWORD_MUST_CONTAIN_DIGITS')
      : !/[^a-zA-Z0-9]/.test(newPassword)
      ? t('CHANGE_PASSWORD.NEW_PASSWORD_MUST_CONTAIN_SYMBOLS')
      : newPassword.length < 8
      ? t('CHANGE_PASSWORD.NEW_PASSWORD_TOO_SHORT_ERROR')
      : undefined

  const checkPasswordError =
    checkPassword === ''
      ? undefined
      : checkPassword !== newPassword
      ? t('CHANGE_PASSWORD.NEW_PASSWORD_MISSMATCH_ERROR')
      : undefined

  return (
    <>
      <DialogTitle>{t('CHANGE_PASSWORD.CHANGE_PASSWORD_DIALOG_TITLE')}</DialogTitle>
      <DialogContent sx={{ minWidth: '20rem' }}>
        <form onSubmit={handleSubmit} method="post">
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              name="currentPassword"
              label={t('CHANGE_PASSWORD.CURRENT_PASSWORD_LABEL')}
              type="password"
              value={currentPassword}
              onChange={(ev) => {
                setCurrentPassword(ev.target.value)
                setError(undefined)
              }}
              error={!!error}
              helperText={error || ' '}
            />
            <TextField
              name="newPassword"
              label={t('CHANGE_PASSWORD.NEW_PASSWORD_LABEL')}
              type="password"
              value={newPassword}
              onChange={(ev) => {
                setNewPassword(ev.target.value)
              }}
              error={!!newPasswordError}
              helperText={
                newPasswordError || ' ' // To avoid relayout when no error
              }
            />
            <TextField
              name="checkPassword"
              label={t('CHANGE_PASSWORD.CHECK_PASSWORD_LABEL')}
              type="password"
              value={checkPassword}
              onChange={(ev) => setCheckPassword(ev.target.value)}
              error={checkPassword !== '' && checkPassword !== newPassword}
              helperText={
                checkPasswordError || ' ' // To avoid relayout when no error
              }
            />
              {isSuccess ? (
                <Alert severity="success">
                  {t('CHANGE_PASSWORD.SUBMIT_BUTTON_CHANGED_PASSWORD')}
                </Alert>
              ) : (
            <DialogActions>
                  <Button onClick={closeDialog}>Cancel</Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={
                      // sending or done
                      isLoading ||
                      isSuccess ||
                      // Any field empty
                      !currentPassword ||
                      !newPassword ||
                      !checkPassword ||
                      // Any field in error
                      !!error ||
                      !!newPasswordError ||
                      !!checkPasswordError
                    }
                  >
                    {isLoading
                      ? t('CHANGE_PASSWORD.SUBMIT_BUTTON_CHANGING_PASSWORD')
                      : t('CHANGE_PASSWORD.SUBMIT_BUTTON_CHANGE_PASSWORD')}
                  </Button>
            </DialogActions>
              )}
          </Stack>
        </form>
      </DialogContent>
    </>
  )
}

export default ChangePasswordDialog
