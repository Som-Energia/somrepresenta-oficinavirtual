/**
A terms checker ask the user for certain terms and conditions
to be accepted before continuing using the application.
The different terms to be accepted separatelly are configured
in a yaml file.
*/
import React, { Children } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import MuiMarkdown from 'mui-markdown'
import { useAuth } from './AuthProvider'
import ov from '../services/ovapi'
import requiredDocuments from '../data/terms.yaml'
import { firstPendingDocument } from '../services/signatures'

function TermsDialog(props) {
  const { document, title, body, accept, onAccept, onReject } = props
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [error, setError] = React.useState(false)

  async function handleAccept() {
    try {
      const result = await ov.signDocument(document)
      onAccept && onAccept()
    } catch (e) {
      console.log(e)
      setError(e.error)
    }
  }

  return (
    <Dialog open fullScreen={fullScreen} scroll="paper">
      <DialogTitle>{t(title)}</DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexFlow: 'column',
          alignItems: 'left',
          p: 2,
          gap: 2,
          maxWidth: '50rem',
        }}
      >
        <Container>
          <MuiMarkdown>{t(body)}</MuiMarkdown>
        </Container>
      </DialogContent>

      {error ? (
        <Box color="error.main">
          <Container>
            {t('TERMS.UNEXPECTED_ERROR')}: {error}
          </Container>
        </Box>
      ) : null}

      <DialogActions>
        <Button variant="contained" color="secondary" onClick={onReject}>
          {t('APP_FRAME.MENU_LOGOUT')}
        </Button>
        <Button variant="contained" color="primary" onClick={handleAccept}>
          {accept ? t(accept) : t('TERMS.ACCEPT')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function TermsCheck({ children }) {
  const { currentUser, logout, reloadUser } = useAuth()

  if (!currentUser) return children

  const tosign = firstPendingDocument(requiredDocuments, currentUser.signed_documents)
  if (tosign === null) return children

  return (
    <>
      <TermsDialog {...tosign} onAccept={reloadUser} onReject={logout} />
      {children}
    </>
  )
}

export default TermsCheck
