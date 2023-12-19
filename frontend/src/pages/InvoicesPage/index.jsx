import React from 'react'
import { useTranslation } from 'react-i18next'
import dummyData from '../../data/dummyinvoices.yaml'
import Button from '@mui/material/Button'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import DescriptionIcon from '@mui/icons-material/Description'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import DownloadIcon from '@mui/icons-material/Download'
import { Link } from 'react-router-dom'
import TableEditor from '../../components/TableEditor'
import { useAuth } from '../../components/AuthProvider'
import ovapi from '../../services/ovapi'
import PageTitle from '../../components/PageTitle'
import Loading from '../../components/Loading'
import ErrorSplash from '../../components/ErrorSplash'
import format from '../../services/format'

export default function InvoicesPage(params) {
  const { t, i18n } = useTranslation()
  const [isLoading, beLoading] = React.useState(true)
  const [rows, setRows] = React.useState([])
  const [error, setError] = React.useState(false)
  const { currentUser } = useAuth()

  React.useEffect(() => {
    getInvoices()
  }, [currentUser])

  async function getInvoices() {
    beLoading(true)
    setRows([])
    setError(false)
    try {
      setRows(await ovapi.invoices(currentUser))
    } catch (error) {
      setError(error)
    }
    beLoading(false)
  }

  const columns = [
    {
      id: 'invoice_number', // TODO: can we name it contract?
      label: t('INVOICES.COLUMN_INVOICE_NUMBER'),
      searchable: true,
      numeric: false,
    },
    {
      id: 'contract_number',
      label: t('INVOICES.COLUMN_CONTRACT'),
      searchable: true,
      numeric: false,
    },
    {
      id: 'concept',
      label: t('INVOICES.COLUMN_CONCEPT'),
      searchable: true,
      numeric: false,
    },
    {
      id: 'liquidation',
      label: t('INVOICES.COLUMN_LIQUIDATION'),
      searchable: true,
      numeric: false,
    },
    {
      id: 'emission_date',
      label: t('INVOICES.COLUMN_EMITTED'),
      searchable: false,
      numeric: false,
      view: (row)=>format.date(row.emission_date)
    },
    {
      id: 'first_period_date',
      label: t('INVOICES.COLUMN_PERIOD'),
      searchable: false,
      numeric: false,
      view: (row) => (
        <Box sx={{ whiteSpace: 'nowrap' }}>{`${format.date(
          row.first_period_date,
        )} - ${format.date(row.last_period_date)}`}</Box>
      ),
    },
    {
      id: 'amount',
      label: t('INVOICES.COLUMN_AMOUNT'),
      searchable: false,
      numeric: true,
      view: (row) => format.euros(row.amount),
    },
  ]
  const actions = []
  const selectionActions = [
    {
      title: t('INVOICES.TOOLTIP_DOWNLOAD_ZIP'),
      icon: <DownloadIcon />,
    },
  ]
  const itemActions = [
    {
      title: t('INVOICES.TOOLTIP_PDF'),
      icon: <PictureAsPdfIcon />,
      cacaview: (invoice) => {
        return (
          <Button
            variant="contained"
            size="small"
            component={Link}
            to={`/installation/${invoice.invoice_number}`}
            startIcon={<PictureAsPdfIcon />}
          >
            {t('INVOICES.BUTTON_PDF')}
          </Button>
        )
      },
    },
  ]
  return isLoading ? (
    <Loading />
  ) : (
    <Container>
      <PageTitle Icon={DescriptionIcon}>{t('INVOICES.INVOICES_TITLE')}</PageTitle>
      {error ? (
        <ErrorSplash
          title={error.context}
          message={error.error}
          backaction={() => getInvoices()}
          backtext={t('INVOICES.RELOAD')}
        />
      ) : (
        <TableEditor
          title={t('INVOICES.TABLE_TITLE')}
          defaultPageSize={12}
          pageSizes={[]}
          columns={columns}
          rows={rows}
          actions={actions}
          selectionActions={selectionActions}
          itemActions={itemActions}
          idField={'invoice_number'}
          loading={isLoading}
          noDataPlaceHolder={
            <TableRow>
              <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
                <Typography variant="h4">
                  {t('INVOICES.NO_INVOICES')}
                  <br />
                  🤷‍♀️
                </Typography>
              </TableCell>
            </TableRow>
          }
        ></TableEditor>
      )}
    </Container>
  )
}
