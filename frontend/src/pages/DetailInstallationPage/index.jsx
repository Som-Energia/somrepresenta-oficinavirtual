import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Alert } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ov from '../../services/ovapi'
import Loading from '../../components/Loading'
import PageTitle from '../../components/PageTitle'
import SolarPowerIcon from '@mui/icons-material/SolarPower'
import SimpleTable from '../../components/SimpleTable'

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
  }, [contract_number])

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
      <PageTitle Icon={SolarPowerIcon}>
        {t('INSTALLATION_DETAIL.DETAILS_TITLE')}
      </PageTitle>
      <SimpleTable
        fields={installationDetail}
        translationsPrefix="INSTALLATION_DETAIL"
        title={t('INSTALLATION_DETAIL.INSTALLATION_DETAILS_TITLE')}
      />
      <SimpleTable
        fields={contractDetail}
        translationsPrefix="CONTRACT_DETAIL"
        title={t('CONTRACT_DETAIL.CONTRACT_DETAILS_TITLE')}
      />
    </Container>
  ) : (
    <Loading />
  )
}
