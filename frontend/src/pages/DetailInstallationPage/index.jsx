import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Container from '@mui/material/Container'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import SolarPowerIcon from '@mui/icons-material/SolarPower'
import ovapi from '../../services/ovapi'
import Loading from '../../components/Loading'
import PageTitle from '../../components/PageTitle'
import SimpleTable from '../../components/SimpleTable'
import ErrorSplash from '../../components/ErrorSplash'
import NavigationButtons from '../../components/NavigationButtons'
import { contractFields } from './detailInstallationData'
import { installationFields } from './detailInstallationData'
import transformContractDetails  from './detailInstallationData'

export default function DetailInstallationPage(params) {
  const { contract_number } = useParams()
  const { t } = useTranslation()
  const [installationDetail, setInstallationDetail] = useState(undefined)
  const [contractDetail, setContractDetail] = useState(undefined)
  const [error, setError] = useState(false)

  useEffect(() => {
    getDetailInstallation()
  }, [contract_number])

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
          {/* TODO: get the before and after user installations */}
          <NavigationButtons
            toBefore="/installation/00001"
            toNext="/installation/00001"
            toReturn="/installation"
            returnIcon={<FormatListBulletedIcon />}
          />
          <SimpleTable
            fields={installationDetail}
            fieldsOrder={installationFields}
            translationsPrefix="INSTALLATION_DETAIL"
            title={t('INSTALLATION_DETAIL.INSTALLATION_DETAILS_TITLE')}
          />
          <SimpleTable
            fields={contractDetail}
            fieldsOrder={contractFields}
            translationsPrefix="CONTRACT_DETAIL"
            title={t('CONTRACT_DETAIL.CONTRACT_DETAILS_TITLE')}
          />
        </>
      )}
    </Container>
  )
}
