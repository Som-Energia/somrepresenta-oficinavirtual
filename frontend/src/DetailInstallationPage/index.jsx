import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import { useParams } from 'react-router-dom'
import { Container, Grid, Typography, Paper, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ov from '../services/ovapi'

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
  const { contract_number } = useParams()
  const { t, i18n } = useTranslation()
  const [installationDetail, setInstallationDetail] = useState(false)
  const [contractDetail, setContractDetail] = useState(false)

  useEffect(() => {
    getDetailInstallation()
  }, [])

  const getDetailInstallation = () => {
    ov.installationDetails(contract_number).then((response) => {
      setInstallationDetail(response?.installation_details)
      setContractDetail(response?.contract_details)
    })
  }

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