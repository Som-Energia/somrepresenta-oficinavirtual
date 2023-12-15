import React from 'react'
import { useTranslation } from 'react-i18next'
import Container from '@mui/material/Container'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import PageTitle from '../../components/PageTitle'
import ErrorSplash from '../../components/ErrorSplash'
import format from '../../services/format'
import NotYetImplementedPage from '../../NotYetImplementedPage'

export default function InvoicesPage(params) {
  const { t, i18n } = useTranslation()

  return (<>
    <Container>
      <PageTitle Icon={QueryStatsIcon}>{t('PRODUCTION.PRODUCTION_TITLE')}</PageTitle>
    </Container>
    <NotYetImplementedPage/>
  </>)
}
