import React, { Children } from 'react'
import { useAuth } from './AuthProvider'
import ov from '../services/ovapi'

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

import { useTranslation } from 'react-i18next'

function RgpdPage({ document }) {
  const { t, i18n } = useTranslation()

  const [error, setError] = React.useState(false)

  async function handleAccept() {
    try {
      const result = await ov.signDocument(document)
      console.log(result)
    } catch (e) {
      setError(e)
    }
  }

  return (
    <Container
      sx={{
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Paper
        sx={{
          display: 'flex',
          flexFlow: 'column',
          alignItems: 'left',
          p: 2,
          gap: 2,
        }}
      >
        <Typography variant="h4">{t('APP_FRAME.RGPD')}</Typography>
        <Typography variant="body1">{t('APP_FRAME.RGPD_TEXT')}</Typography>

        <Box color="error.main">{error}</Box>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button variant="contained" color="primary" onClick={handleAccept}>
            {t('APP_FRAME.ACCEPT_CONDITIONS')}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

function RgpdCheck({ children }) {
  const { currentUser } = useAuth()
  const requiredDocuments = {
    document: 'RGPD_OV_REPRESENTA',
    version: '2023-11-09 00:00:00',
  }
  return <RgpdPage document={requiredDocuments.document + 'CACA'} />
  if (currentUser.signed_documents !== requiredDocuments) incluido
  return <RgpdPage />
  return children
}

export default RgpdCheck
