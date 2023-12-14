import React from 'react'
import { useTranslation } from 'react-i18next'
import dummyData from '../../data/dummyinstallations.yaml'
import Button from '@mui/material/Button'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SolarPowerIcon from '@mui/icons-material/SolarPower'
import { Link } from 'react-router-dom'
import TableEditor from '../../components/TableEditor'
import { useAuth } from '../../components/AuthProvider'
import ovapi from '../../services/ovapi'
import PageTitle from '../../components/PageTitle'
import Loading from '../../components/Loading'

export default function InstallationsPage(params) {
  const { t, i18n } = useTranslation()
  const [isLoading, beLoading] = React.useState(true)
  const [rows, setRows] = React.useState([])
  const { currentUser } = useAuth()

  React.useEffect(() => {
    beLoading(true)
    setRows([])
    ovapi
      .installations(currentUser)
      .then((retrievedRows) => {
        setRows(retrievedRows)
        beLoading(false)
      })
      .catch((error) => {
        beLoading(false)
        console.error(error)
      })
  }, [currentUser])

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
      view: (contract) => {
        return (
          <Button
            variant="contained"
            size="small"
            component={Link}
            to={`/installation/${contract.contract_number}`}
            endIcon={<MoreVertIcon />}
          >
            {t('INSTALLATIONS.BUTTON_DETAILS')}
          </Button>
        )
      },
    },
  ]
  return isLoading ? (
    <Loading />
  ) : (
    <Container>
      <PageTitle Icon={SolarPowerIcon}>
        {t('INSTALLATIONS.INSTALLATIONS_TITLE')}
      </PageTitle>
      <TableEditor
        title={t('INSTALLATIONS.TABLE_TITLE')}
        defaultPageSize={12}
        pageSizes={[]}
        columns={columns}
        rows={rows}
        actions={actions}
        selectionActions={selectionActions}
        itemActions={itemActions}
        idField={'contract_number'}
        loading={isLoading}
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
      ></TableEditor>
    </Container>
  )
}
