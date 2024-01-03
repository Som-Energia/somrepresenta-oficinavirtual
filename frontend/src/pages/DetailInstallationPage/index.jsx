import React, { useEffect, useState, useContext, useMemo } from 'react'
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
import {
  transformContractDetails,
  transformInstallationDetails,
  computeNavigationInfo,
} from './detailInstallationData'
import { InstallationContext } from '../../components/InstallationProvider'

export default function DetailInstallationPage() {
  const { contract_number } = useParams()
  const { t } = useTranslation()
  const {
    installations,
    loading: listLoading,
    error: listError,
  } = useContext(InstallationContext)
  const [details, setDetails] = useState(undefined)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const contractDetails = React.useMemo(
    () => transformContractDetails(details?.contract_details),
    [details],
  )
  const installationDetails = React.useMemo(
    () => transformInstallationDetails(details?.installation_details),
    [details],
  )
  const navigationInfo = React.useMemo(
    () => computeNavigationInfo(installations, contract_number),
    [installations, contract_number],
  )
  const navigationBeforeUrl = navigationInfo.before
    ? `/installation/${navigationInfo.before}`
    : undefined
  const navigationNextUrl = navigationInfo.next
    ? `/installation/${navigationInfo.next}`
    : undefined

  useEffect(() => {
    async function getDetailInstallation() {
      setError(false)
      setLoading(true)
      setDetails(undefined)
      try {
        console.log('Getting Details', contract_number)
        const result = await ovapi.installationDetails(contract_number)
        if (!result) {
          setError(true)
          return
        }
        setDetails(result)
      } catch (error) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    getDetailInstallation()
  }, [contract_number, installations])

  return !error && !details ? (
    <Loading />
  ) : (
    <Container>
      <PageTitle Icon={SolarPowerIcon}>
        {t('INSTALLATION_DETAIL.DETAILS_TITLE')}
        <NavigationButtons
          toBefore={navigationBeforeUrl}
          toNext={navigationNextUrl}
          toReturn="/installation"
          returnIcon={<FormatListBulletedIcon />}
        />
      </PageTitle>
      {error ? (
        <ErrorSplash
          message={t('INSTALLATION_DETAIL.ERROR_LOADING_DATA')}
          backlink="/installation"
          backtext={t('INSTALLATION_DETAIL.BACK_TO_INSTALLATIONS')}
        />
      ) : (
        <>
          <SimpleTable
            fields={installationDetails}
            fieldsOrder={installationFields}
            translationsPrefix="INSTALLATION_DETAIL"
            title={t('INSTALLATION_DETAIL.INSTALLATION_DETAILS_TITLE')}
          />
          <SimpleTable
            fields={contractDetails}
            fieldsOrder={contractFields}
            translationsPrefix="CONTRACT_DETAIL"
            title={t('CONTRACT_DETAIL.CONTRACT_DETAILS_TITLE')}
          />
        </>
      )}
    </Container>
  )
}
