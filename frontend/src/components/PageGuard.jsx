import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import BlockIcon from '@mui/icons-material/Block'
import { useTranslation } from 'react-i18next'
import { useAuth } from './AuthProvider'
import AppFrame from './AppFrame'

function NotAuthenticatedPage() {
  const { t, i18n } = useTranslation()
  const { login } = useAuth()
  return (
    <AppFrame>
      <Container
        sx={{
          display: 'flex',
          flexFlow: 'column',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Typography variant="h4">{t('APP_FRAME.USER_REQUIRED')}</Typography>

        <BlockIcon
          sx={{
            fontSize: '10rem',
            marginBlock: '2rem',
          }}
        />
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button variant="contained" color="primary" onClick={() => login()}>
            {t('APP_FRAME.LOGIN')}
          </Button>
        </Box>
      </Container>
    </AppFrame>
  )
}

function PageGuard(params) {
  const { children } = params
  const { currentUser, login, logout } = useAuth()
  if (currentUser === null) return <NotAuthenticatedPage />
  return <>{children}</>
}

export default PageGuard
