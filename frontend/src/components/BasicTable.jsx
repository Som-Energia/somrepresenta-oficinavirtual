import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'

const BasicTable = ({ row }) => {
  return (
    <TableContainer>
      <Table
        sx={{
          borderTop: 1,
          borderBottom: 1,
          borderColor: '#8080804a',
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
                {row.path}
              </TableCell>
              <TableCell align="justify" sx={{ border: 0 }}>
                {row.url}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export default BasicTable
