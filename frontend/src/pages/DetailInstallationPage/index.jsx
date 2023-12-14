import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Alert } from '@mui/material'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import ovapi from '../../services/ovapi'
import Loading from '../../components/Loading'
import PageTitle from '../../components/PageTitle'
import SolarPowerIcon from '@mui/icons-material/SolarPower'
import SimpleTable from '../../components/SimpleTable'
import ErrorSplash from '../../components/ErrorSplash'

export default function DetailInstallationPage(params) {
  const { contract_number } = useParams()
  const { t } = useTranslation()
  const [installationDetail, setInstallationDetail] = useState(undefined)
  const [contractDetail, setContractDetail] = useState(undefined)
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
    setError(false)
    setInstallationDetail(undefined)
    setContractDetail(undefined)
    var result
    try {
      result = await ovapi.installationDetails(contract_number)
    } catch (e) {
      setError(e)
      return
    }
    setInstallationDetail(result?.installation_details)
    const contractData = transformContractDetails(result?.contract_details)
    setContractDetail(contractData)
  }

  return !error && (!installationDetail || !contractDetail) ? (
    <Loading />
  ) : (
    <Container>
      <PageTitle Icon={SolarPowerIcon}>
        {t('INSTALLATION_DETAIL.DETAILS_TITLE')}
      </PageTitle>
      {error ? (
        <ErrorSplash
          title={t('INSTALLATION_DETAIL.ERROR_LOADING_DATA')}
          message={error.error}
          backlink="/installation"
          backtext={t('INSTALLATION_DETAIL.BACK_TO_INSTALLATIONS')}
        />
      ) : (
        <>
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
        </>
      )}
    </Container>
  )
}
