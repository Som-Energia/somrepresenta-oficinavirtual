import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const BasicTable = ({ row }) => {
  const { t } = useTranslation()

  return (
    <TableContainer>
      <Table
        sx={{
          borderTop: 1,
          borderBottom: 1,
          borderColor: '#8080804a',
          padding: 0,
        }}
      >
        <TableBody>
          {row.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{ border: 0, fontWeight: 700 }}>
                {row.name}
              </TableCell>
              <TableCell align="justify" sx={{ border: 0 }}>
                {t(row.path)}
              </TableCell>
              <TableCell align="right" sx={{ border: 0 }}>
                <Link to={`https://${row.url}`} activeClassName="current">
                  {row.url}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export default BasicTable
