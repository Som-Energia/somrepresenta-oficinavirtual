import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { useParams } from 'react-router-dom'
import { Container, Grid, Typography, Paper } from '@mui/material'
import { useTranslation } from 'react-i18next'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
  borderRadius: '0px',
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

// TODO: make it grid! and decide the format that fields has to have
const PrettyBox = ({ title = false, fields, translationsPrefix = 'DETAILS' }) => {
  const { t, i18n } = useTranslation()
  const data = Object.entries(fields)

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Item sx={{ backgroundColor: 'table.titleColor' }}>
            <b>{title}</b>
          </Item>
        </Grid>
        <Grid item xs={4}>
          {data.map((detail) => (
            <Item>
              <b>{t(`${translationsPrefix}.${detail[0].toUpperCase()}`)}</b>
            </Item>
          ))}
        </Grid>
        <Grid item xs={8}>
          {data.map((detail) => (
            <Item>{detail[1] ? detail[1] : '-'}</Item>
          ))}
        </Grid>
      </Grid>
    </Container>
  )
}

// TODO: delete if proposed design is not a must, btw it has to be a grid too
const ProposedBox = ({ title = false, fields, translationsPrefix = 'DETAILS' }) => {
  const { t, i18n } = useTranslation()
  const data = Object.entries(fields)

  return (
    <Container>
      <Box sx={{ width: '100%', marginBottom: '1rem' }}>
        <Item sx={{ backgroundColor: 'table.titleColor' }}>
          <b>{title}</b>
        </Item>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'table.rowTitle',
            color: 'table.textColor',
            border: '1px solid black',
            marginRight: '1rem',
          }}
        >
          {data.map(
            (detail) =>
              detail[1] && (
                <label style={{ padding: '6px' }}>
                  {t(`${translationsPrefix}.${detail[0].toUpperCase()}`)}
                </label>
              ),
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'table.rowValue',
            color: 'table.textColor',
            border: '1px solid black',
          }}
        >
          {data.map((detail) => (
            <label style={{ padding: '6px' }}>{detail[1]}</label>
          ))}
        </Box>
      </Box>
    </Container>
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
      &nbsp;
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
