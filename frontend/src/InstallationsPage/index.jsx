import React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next'
import TableEditor from '../components/TableEditor'
import dummyData from '../data/dummyinstallations.yaml'

export default function InstalltionsPage(params) {
  const { t, i18n } = useTranslation()
  const rows = dummyData
  const columns = [
    {
      id: 'id', // TODO: can we name it contract?
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
      title: 'Details',
      icon: <SearchIcon fontSize="inherit" />,
      handler: (item)=>{console.log("Voy!!", item)},
    },
  ]
  return (
    <TableEditor
      title={t('INSTALLATIONS.TABLE_TITLE')}
      defaultPageSize={12}
      pageSizes={[-1, 12, 18, 25]}
      columns={columns}
      rows={rows}
      actions={actions}
      selectionActions={selectionActions}
      itemActions={itemActions}
    ></TableEditor>
  )
}
