import React from 'react'
import { useTranslation } from 'react-i18next'
import Container from '@mui/material/Container'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import PageTitle from '../../components/PageTitle'
import NotYetImplementedPage from '../../NotYetImplementedPage'

export default function InvoicesPage(params) {
  const { t } = useTranslation()

  return (
    <>
      <Container>
        <PageTitle Icon={QueryStatsIcon}>{t('PRODUCTION.PRODUCTION_TITLE')}</PageTitle>
      </Container>
      <NotYetImplementedPage />
    </>
  )
}
