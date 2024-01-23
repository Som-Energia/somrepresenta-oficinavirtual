import React from 'react'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import { useTranslation } from 'react-i18next'
import { useCookies } from "react-cookie";
import ov from '../services/ovapi'
import wait from '../services/wait'
import useLocalStorage from '../hooks/LocalStorage'

// TODO: Let the user inject the specific function
// to actually perform the action and thus removing the
// dependency on ov

function HijackDialog(params) {
    const { closeDialog } = params
    const [username, setUsername] = React.useState('')
    const [isLoading, beLoading] = React.useState(false)
    const [error, setError] = React.useState()
    const [cookies, setCookie] = useCookies(['Hijacked']);
    const { t, i18n } = useTranslation()

    async function handleSubmit(ev) {
      ev.preventDefault()
      beLoading(true)
      ov.hijack(username)
        .then((response) => {
          if (response.code === 'VALIDATION_ERROR') {
            setError(t('HIJACK.VALIDATION_ERROR'))
            beLoading(false)
            return
          }
          if (response.error){
            setError(t('HIJACK.UNABLE_TO_HIJACK'))
            beLoading(false)
            return
          }
          setCookie('Hijacked', true)
          closeDialog()
        })
    }
    return (
      <>
        <DialogTitle>{t('HIJACK.HIJACK_DIALOG_TITLE')}</DialogTitle>
        <DialogContent sx={{ minWidth: '20rem' }}>
          <form onSubmit={handleSubmit} method="post">
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField
                name="user"
                label={t('HIJACK.USERNAME_LABEL')}
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
                helperText={t('HIJACK.USERNAME_HELP')}
              />
              <Box color="error.main">{error}</Box>
              <DialogActions>
                <Button onClick={closeDialog}>Cancel</Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading || !username}
                >
                  {isLoading
                    ? t('HIJACK.SUBMIT_BUTTON_PROCESSING')
                    : t('HIJACK.SUBMIT_BUTTON_HIJACK')}
                </Button>
              </DialogActions>
            </Stack>
          </form>
        </DialogContent>
      </>
    )
  }

  export default HijackDialog
