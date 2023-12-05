import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import { useParams } from 'react-router-dom'
import { Container, Grid, Typography, Paper, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

const Item = styled('div')(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.table.contentDark
      : theme.palette.table.contentLight,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
}))

// TODO: move to a file
const dummyData = {
  contract_details: {
    billing_mode: 'index',
    cost_deviation: 'included',
    discharge_date: '2022-09-21',
    iban: '**** **** **** **** **** 6718',
    proxy_fee: 0.12,
    reduction_deviation: 100,
    representation_type: 'directa_cnmc',
    status: 'activa',
  },
  installation_details: {
    address: 'CL Perico Palotes 38 17004 (Girona)',
    cil: 'ES0000000000000000AA0A000',
    city: 'Girona',
    contract_number: '00001',
    coordinates: '41.55476,-4.10777',
    ministry_code: 'RE-008800',
    name: 'Central de Test',
    postal_code: '17004',
    province: 'Girona',
    rated_power: 1000,
    technology: false,
    type: 'IT-00666',
  },
}

const PrettyBox = ({ title = false, fields, translationsPrefix = 'DETAILS' }) => {
  const { t, i18n } = useTranslation()
  const data = Object.entries(fields)

  return (
    <Grid
      container
      sx={{
        width: 'auto',
        marginLeft: '1rem',
        marginTop: '2rem',
        marginRight: '1rem',
      }}
    >
      <Item
        sx={{ backgroundColor: 'table.titleColor', width: '100%', marginBottom: '1rem' }}
      >
        <b>{title}</b>
      </Item>
      <div style={{ width: '100%' }}>
        {data.map((detail) => (
          <Box sx={{ display: 'flex', width: '100%' }}>
            <Grid
              item
              xs={4}
              sx={{ marginRight: '1rem', display: 'grid', overflow: 'hidden' }}
            >
              <Item>
                <b>{t(`${translationsPrefix}.${detail[0].toUpperCase()}`)}</b>
              </Item>
            </Grid>
            <Grid item xs={8} sx={{ display: 'grid', overflow: 'hidden' }}>
              <Item>{detail[1] ? detail[1] : '-'}</Item>
            </Grid>
          </Box>
        ))}
      </div>
    </Grid>
  )
}

const Loading = () => {
  return <div>Loading...</div>
}

export default function DetailInstallationPage(params) {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const [installationDetail, setInstallationDetail] = useState(false)
  const [contractDetail, setContractDetail] = useState(false)

  useEffect(() => {
    getDetailInstallation(id)
  }, [])

  const getDetailInstallation = ({ contractId }) => {
    // TODO: ask backend detail installation data from id
    setInstallationDetail(dummyData?.installation_details)
    setContractDetail(dummyData?.contract_details)
  }

  console.log('Detail installation', installationDetail)
  return installationDetail && contractDetail ? (
    <Container>
      <Typography variant="h3" sx={{ mb: 3 }}>
        {t('INSTALLATION_DETAIL.DETAILS_TITLE')}
      </Typography>
      <PrettyBox
        fields={installationDetail}
        translationsPrefix="INSTALLATION_DETAIL"
        title={t('INSTALLATION_DETAIL.INSTALLATION_DETAILS_TITLE')}
      />
      <PrettyBox
        fields={contractDetail}
        translationsPrefix="CONTRACT_DETAIL"
        title={t('CONTRACT_DETAIL.CONTRACT_DETAILS_TITLE')}
      />
    </Container>
  ) : (
    <Loading />
  )
}
