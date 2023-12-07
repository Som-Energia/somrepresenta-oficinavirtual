import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import { useParams } from 'react-router-dom'
import { Container, Grid, Typography, Paper, Box, Alert } from '@mui/material'
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

// TODO: extract this generic component if we want to use it
const PrettyBox = ({ title = false, fields, translationsPrefix = 'DETAILS' }) => {
  const { t } = useTranslation()
  const data = Object.entries(fields)
  return (
    <Grid
      container
      sx={{ width: 'auto', marginLeft: '1rem', marginTop: '2rem', marginRight: '1rem' }}
    >
      {title && (
        <Item
          sx={{
            backgroundColor: 'table.titleColor',
            width: '100%',
            marginBottom: '1rem',
          }}
        >
          <b>{title}</b>
        </Item>
      )}
      <Box sx={{ width: '100%' }}>
        {data.map((detail, index) => (
          <Box key={index} sx={{ display: 'flex', width: '100%' }}>
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
      </Box>
    </Grid>
  )
}

// TODO: create or use a loading component
const Loading = () => {
  return <div>Loading...</div>
}

// TODO: create or use a generic context to set app alert messages
const AlertError = ({ error }) => {
  const { t } = useTranslation()
  return (
    <Alert sx={{ margin: '1rem' }} severity="error">
      {t(`ERROR.${error}`)}
    </Alert>
  )
}

export default function DetailInstallationPage(params) {
  const { contract_number } = useParams()
  const { t } = useTranslation()
  const [installationDetail, setInstallationDetail] = useState(false)
  const [contractDetail, setContractDetail] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    getDetailInstallation()
  }, [])

  // TODO: check if we can get this data from backend or move this function
  function transformContractDetails(contractData) {
    if (contractData.cost_deviation == 'included') {
      contractData['reduction_deviation'] += ' %'
    } else {
      contractData['reduction_deviation'] = 'N/A'
    }
    return contractData
  }

  async function getDetailInstallation() {
    try {
      const result = await ov.installationDetails(contract_number)
      setInstallationDetail(result?.installation_details)
      const contractData = transformContractDetails(result?.contract_details)
      setContractDetail(contractData)
    } catch (e) {
      // TODO: check how errors are managed
      setError(e.code)
    }
  }

  return error ? (
    <AlertError error={error} />
  ) : installationDetail && contractDetail ? (
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
