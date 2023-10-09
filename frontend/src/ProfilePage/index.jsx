import React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { useTranslation } from 'react-i18next'
import AppFrame from '../components/AppFrame'
import { useAuth } from '../components/AuthProvider'


export default function ProfilePage(params) {
  const { t, i18n } = useTranslation()
  const { currentUser } = useAuth()
  return (
    <AppFrame>
      <Container>
        Hello world
        <pre>{JSON.stringify(currentUser, null, 2)}</pre>
      </Container>
    </AppFrame>
  )
}
