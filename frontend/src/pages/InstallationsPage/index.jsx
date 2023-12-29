import React, { useContext, useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SolarPowerIcon from '@mui/icons-material/SolarPower'
import { Link } from 'react-router-dom'
import TableEditor from '../../components/TableEditor'
import PageTitle from '../../components/PageTitle'
import Loading from '../../components/Loading'
import ErrorSplash from '../../components/ErrorSplash'
import { InstallationContext } from '../../components/InstallationProvider'

export default function InstallationsPage(params) {
  const { t, i18n } = useTranslation()
  const [pageLoading, setPageLoading] = useState(true)
  const { installations, error } = useContext(InstallationContext)
  const memoizedInstallations = useMemo(() => installations, [installations])

  useEffect(() => {
    setPageLoading(true)
    if (installations) {
      setPageLoading(false)
    }
  }, [installations])

  const columns = [
    {
      id: 'contract_number', // TODO: can we name it contract?
      label: t('INSTALLATIONS.COLUMN_CONTRACT_NUMBER'),
      searchable: true,
      numeric: false,
    },
    {
      id: 'installation_name',
      label: t('INSTALLATIONS.COLUMN_INSTALLATION_NAME'),
      searchable: true,
      numeric: false,
    },
  ]

  const actions = []
  const selectionActions = []

  const itemActions = [
    {
      title: t('INSTALLATIONS.TOOLTIP_DETAILS'),
      view: (contract) => (
        <Button
          variant="contained"
          size="small"
          component={Link}
          to={`/installation/${contract.contract_number}`}
          endIcon={<ChevronRightIcon />}
        >
          {t('INSTALLATIONS.BUTTON_DETAILS')}
        </Button>
      ),
    },
  ]

  return pageLoading ? (
    <Loading />
  ) : (
    <Container>
      <PageTitle Icon={SolarPowerIcon}>
        {t('INSTALLATIONS.INSTALLATIONS_TITLE')}
      </PageTitle>
      {error ? (
        <ErrorSplash
          title={error.context}
          message={error.error}
          backlink="/installation"
          backtext={t('INSTALLATIONS.RELOAD')}
        />
      ) : (
        <TableEditor
          title={t('INSTALLATIONS.TABLE_TITLE', { n: memoizedInstallations.length })}
          defaultPageSize={12}
          pageSizes={[]}
          columns={columns}
          rows={memoizedInstallations}
          actions={actions}
          selectionActions={selectionActions}
          itemActions={itemActions}
          idField={'contract_number'}
          loading={pageLoading}
          noDataPlaceHolder={
            <TableRow>
              <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
                <Typography variant="h4">
                  {t('INSTALLATIONS.NO_INSTALLATIONS')}
                  <br />
                  🤷‍♀️
                </Typography>
              </TableCell>
            </TableRow>
          }
        />
      )}
    </Container>
  )
}
