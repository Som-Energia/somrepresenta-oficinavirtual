import React from 'react'
import { useTranslation } from 'react-i18next'
import dummyData from '../data/dummyinstallations.yaml'
import { Button } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Link } from 'react-router-dom';
import TableEditor from '../components/TableEditor'

export default function InstallationsPage(params) {
  const { t, i18n } = useTranslation()
  const rows = dummyData
  const columns = [
    {
      id: 'contract_number', // TODO: can we name it contract?
      label: t('INSTALLATIONS.COLUMN_CONTRACT_NUMBER'),
      searchable: true,
      numeric: false,
      disablePadding: true,
    },
    {
      id: 'name',
      label: t('INSTALLATIONS.COLUMN_INSTALLATION_NAME'),
      searchable: true,
      numeric: false,
      disablePadding: false,
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
            onClick={() => {
              console.log('Voy!!', contract)
            }}
            endIcon={<MoreVertIcon />}
          >
            {t('INSTALLATIONS.BUTTON_DETAILS')}
          </Button>
        )
      },
    },
  ]
  return (
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
    ></TableEditor>
  )
}
