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
import transformContractDetails, {
  transformContractDetails,
  transformInstallationDetails,
  computeNavigationInfo,
} from './detailInstallationData'
import { useAuth } from '../../components/AuthProvider'
// import { useInstallationContext } from '../../components/InstallationProvider'

export default function DetailInstallationPage(params) {
  const { contract_number } = useParams()
  const { t } = useTranslation()
  const [installationDetail, setInstallationDetail] = useState(undefined)
  const [contractDetail, setContractDetail] = useState(undefined)
  const [error, setError] = useState(false)
  const [rows, setRows] = React.useState([])
  const [navigationBeforeUrl, setNavigationBeforeUrl] = React.useState(undefined)
  const [navigationNextUrl, setNavigationNextUrl] = React.useState(undefined)
  // const data = useInstallationContext()
  const { currentUser } = useAuth()

  useEffect(() => {
    getDetailInstallation()
    getNavigationInfo()
  }, [contract_number, currentUser])

  async function getDetailInstallation() {
    setError(false)
    setInstallationDetail(undefined)
    setContractDetail(undefined)
    const result = await ovapi.installationDetails(contract_number)
    if (!result) {
      setError(true)
      return
    }
    const installationData = transformInstallationDetails(result?.installation_details)
    setInstallationDetail(installationData)
    const contractData = transformContractDetails(result?.contract_details)
    setContractDetail(contractData)
  }

  async function getNavigationInfo() {
    setError(false)
    try {
      const installations = await ovapi.installations(currentUser)
      const navigationInfo = computeNavigationInfo(installations, installationDetail?.contract_number)
      const navigationBeforeUrl = navigationInfo.before ? `/installation/${navigationInfo.before}` : undefined
      const navigationNextUrl = navigationInfo.next ? `/installation/${navigationInfo.next}` : undefined
      setNavigationBeforeUrl(navigationBeforeUrl)
      setNavigationNextUrl(navigationNextUrl)
    } catch (error) {
      setError(error)
    }
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
          message={t('INSTALLATION_DETAIL.ERROR_LOADING_DATA')}
          backlink="/installation"
          backtext={t('INSTALLATION_DETAIL.BACK_TO_INSTALLATIONS')}
        />
      ) : (
        <>
          <NavigationButtons
            toBefore={navigationBeforeUrl}
            toNext={navigationNextUrl}
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
