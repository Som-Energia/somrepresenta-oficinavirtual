import React from 'react'
import PropTypes from 'prop-types'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TableEditor from '../../components/TableEditor'
import InvoiceList from './InvoiceList'

/**
Provides responsive interaction with a list of objects.
Uses a TableEditor for large screen formats and a ListEditor for smaller ones.
*/
export default function MultiDataEditor({
  title,
  tableBreakPoint = 'md',
  rows,
  columns,
  idField,
  itemAvatar,
  itemHeader,
  itemBody,
  itemActions,
  actions,
  selectionActions,
  isLoading,
  noDataPlaceHolder,
}) {
  const theme = useTheme()
  const useList = useMediaQuery(theme.breakpoints.down(tableBreakPoint))
  if (useList)
    return (
      <InvoiceList
        rows={rows}
        columns={columns}
        idField={idField}
        itemAvatar={itemAvatar}
        itemHeader={itemHeader}
        itemBody={itemBody}
        itemActions={itemActions}
      />
    )
  return (
    <TableEditor
      title={title}
      defaultPageSize={12}
      pageSizes={[]}
      columns={columns}
      rows={rows}
      actions={actions}
      selectionActions={selectionActions}
      itemActions={itemActions}
      idField={idField}
      loading={isLoading}
      noDataPlaceHolder={
        // TODO: Move row and cell inside component, 9 should be computed
        <TableRow>
          <TableCell colSpan={9} sx={{ textAlign: 'center' }}>
            {noDataPlaceHolder}
          </TableCell>
        </TableRow>
      }
    ></TableEditor>
  )
}
