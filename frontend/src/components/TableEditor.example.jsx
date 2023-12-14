import React from 'react'
import { useTranslation } from 'react-i18next'
import dummyData from '../data/dummyinstallations.yaml'
import Button from '@mui/material/Button'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import SolarPowerIcon from '@mui/icons-material/SolarPower'
import { Link } from 'react-router-dom'
import TableEditor from '../components/TableEditor'
import { useAuth } from '../components/AuthProvider'
import ovapi from '../services/ovapi'
import PageTitle from '../components/PageTitle'
import Loading from '../components/Loading'

export default function Example(params) {
  const { t, i18n } = useTranslation()
  const [isLoading, beLoading] = React.useState(false)
  const [hasSelection, haveSelection] = React.useState(true)
  const [rows, setRows] = React.useState(dummyData)
  const { currentUser } = useAuth()

  function handleDeleteMultiple(items) {
    console.log(items)
    setRows((rows) => rows.filter((r) => !items.includes(r.contract_number)))
  }

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
  const selectionActions = hasSelection
    ? [
        {
          icon: <DeleteIcon />,
          title: 'delete',
          handler: handleDeleteMultiple,
        },
      ]
    : []
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
  return (
    <>
      <h1>TableEditor</h1>
      <FormControlLabel
        control={
          <Checkbox
            checked={hasSelection}
            onChange={(e) => haveSelection(e.target.checked)}
          />
        }
        label={'Selection actions'}
      ></FormControlLabel>
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
    </>
  )
}
