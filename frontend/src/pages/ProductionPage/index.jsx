import React from 'react'
import { useTranslation } from 'react-i18next'
import Container from '@mui/material/Container'
import ChartProductionData from '../../components/ChartProductionData'

export default function ProductionPage(params) {
  const { t } = useTranslation()

  return (
    <>
      <Container>
        <ChartProductionData />
      </Container>
    </>
  )
}
