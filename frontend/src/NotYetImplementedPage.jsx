import React from 'react'
import { useTranslation } from 'react-i18next'
import Container from '@mui/material/Container'
import ErrorSplash from './components/ErrorSplash.jsx'

export default function Page() {
  const { t } = useTranslation()
  return (
    <Container>
      <ErrorSplash
        message={t('APP_FRAME.NOT_YET_IMPLEMENTED')}
        backlink="/"
        backtext={t('APP_FRAME.GO_HOME')}
      />
    </Container>
  )
}
