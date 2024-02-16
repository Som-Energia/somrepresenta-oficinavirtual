import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import DescriptionIcon from '@mui/icons-material/Description'
import RoomServiceIcon from '@mui/icons-material/RoomService'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import StorefrontIcon from '@mui/icons-material/Storefront'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import DownloadIcon from '@mui/icons-material/Download'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import DoneIcon from '@mui/icons-material/Done'
import ClearIcon from '@mui/icons-material/Clear'
import ScheduleIcon from '@mui/icons-material/Schedule'
import TableEditor from '../../components/TableEditor'
import PageTitle from '../../components/PageTitle'
import Loading from '../../components/Loading'
import ErrorSplash from '../../components/ErrorSplash'
import { useAuth } from '../../components/AuthProvider'
import DownloadButton from './DownloadButton'
import DownloadZipButton from './DownloadZipButton'
import InvoiceList from './InvoiceList'
import ovapi from '../../services/ovapi'
import format from '../../services/format'
import messages from '../../services/messages'
//import dummyData from '../../data/dummyinvoices.yaml'

const paymentColors = {
  paid: 'success.main',
  unpaid: 'error.main',
  open: 'warning.main',
}

const paymentIcons = {
  paid: DoneIcon,
  unpaid: ClearIcon,
  open: RestartAltIcon,
}

function PaymentIcon({ payment_status }) {
  const { t } = useTranslation()
  const color =
    {
      paid: 'success.main',
      unpaid: 'error.main',
      open: 'warning.main',
    }[payment_status] || 'warning.main'
  const Icon =
    {
      paid: DoneIcon,
      unpaid: ClearIcon,
      open: ScheduleIcon,
    }[payment_status] || RestartAltIcon
  const payment_status_options = {
    paid: t('INVOICES.PAID_STATUS_OPTION_PAID_VERBOSE'),
    unpaid: t('INVOICES.PAID_STATUS_OPTION_UNPAID_VERBOSE'),
    open: t('INVOICES.PAID_STATUS_OPTION_OPEN_VERBOSE'),
  }
  return (
    <>
      {
        //format.enumeration(payment_status, payment_status_options)
      }
      <Icon
        sx={{ color, verticalAlign: 'middle' }}
        {...{'aria-description': format.enumeration(payment_status, payment_status_options)}}
      />
    </>
  )
}

function PaymentCell({ payment_status }) {
  const { t } = useTranslation()
  const color = {
    paid: 'success.main',
    open: 'warning.main',
    unpaid: 'error.main',
  }[payment_status] || 'warning.main'
  const Icon = {
    paid: DoneIcon,
    open: RestartAltIcon,
    unpaid: ClearIcon,
  }[payment_status] || RestartAltIcon
  const payment_status_options = {
    paid: t('INVOICES.PAID_STATUS_OPTION_PAID'),
    open: t('INVOICES.PAID_STATUS_OPTION_OPEN'),
    unpaid: t('INVOICES.PAID_STATUS_OPTION_UNPAID'),
  }
  return (
    <>
      <Icon sx={{ color, verticalAlign: 'middle' }} />
      {format.enumeration(payment_status, payment_status_options)}
    </>
  )
}

PaymentCell.propTypes = {
  payment_status: PropTypes.oneOf(['paid', 'open', 'unpaid']).isRequired
}

export default function InvoicesPage() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = React.useState(true)
  const [rows, setRows] = React.useState([])
  const [error, setError] = React.useState(false)
  const { currentUser } = useAuth()
  const theme = useTheme()
  const isSm = useMediaQuery(theme.breakpoints.down('md'))
  const isPaymentEnabled = import.meta.env.VITE_ENABLE_INVOICE_PAYMENT == false

  React.useEffect(() => {
    getInvoices()
  }, [currentUser])

  async function getInvoices() {
    setIsLoading(true)
    setRows([])
    setError(false)
    try {
      setRows(await ovapi.invoices(currentUser))
    } catch (error) {
      setError(error)
    }
    setIsLoading(false)
  }

  const concept_options = {
    market: t('INVOICES.CONCEPT_OPTION_MARKET'),
    specific_retribution: t('INVOICES.CONCEPT_OPTION_SPECIFIC_RETRIBUTION'),
    services: t('INVOICES.CONCEPT_OPTION_SERVICES'),
  }
  const concept_icons = {
      market: StorefrontIcon,
      specific_retribution: RequestQuoteIcon,
      services: RoomServiceIcon,
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
      view: (invoice) => format.enumeration(invoice.concept, concept_options),
    },
    // {
    //   id: 'liquidation',
    //   label: t('INVOICES.COLUMN_LIQUIDATION'),
    //   searchable: true,
    //   numeric: false,
    // },
    {
      id: 'emission_date',
      label: t('INVOICES.COLUMN_EMITTED'),
      searchable: false,
      numeric: false,
      view: (invoice) => format.date(invoice.emission_date),
    },
    {
      id: 'first_period_date',
      label: t('INVOICES.COLUMN_PERIOD'),
      searchable: false,
      numeric: false,
      view: (invoice) => (
        <Box sx={{ whiteSpace: 'nowrap' }}>{`${format.date(
          invoice.first_period_date,
        )} - ${format.date(invoice.last_period_date)}`}</Box>
      ),
    },
    {
      id: 'amount',
      label: t('INVOICES.COLUMN_AMOUNT'),
      searchable: false,
      numeric: true,
      view: (invoice) => format.euros(invoice.amount),
    },
    {
      id: 'state',
      label: t('INVOICES.COLUMN_PAID_STATUS'),
      searchable: false,
      numeric: false,
      view: (invoice) => <PaymentCell payment_status={invoice.payment_status} />,
    },
  ]
  const actions = []
  const selectionActions = [
    {
      title: t('INVOICES.TOOLTIP_DOWNLOAD_ZIP'),
      icon: <DownloadIcon />,
      view: (invoices) => (
        <DownloadZipButton context={invoices} title={t('INVOICES.TOOLTIP_DOWNLOAD_ZIP')} />
      ),
    },
  ]
  const itemActions = [
    {
      title: t('INVOICES.TOOLTIP_PDF'),
      icon: <PictureAsPdfIcon />,
      view: (invoice) => (
        <DownloadButton
          size={isSm ? 'large' : 'small'}
          context={invoice}
          title={t('INVOICES.TOOLTIP_PDF')}
        />
      ),
    },
  ]
  if (isLoading) return <Loading />
  return (
    <Container>
      <PageTitle Icon={DescriptionIcon}>{t('INVOICES.INVOICES_TITLE')}</PageTitle>
      {error ? (
        <ErrorSplash
          title={error.context}
          message={error.error}
          backaction={() => getInvoices()}
          backtext={t('INVOICES.RELOAD')}
        />
      ) : isSm ? (
        <InvoiceList
          rows={rows}
          columns={columns}
          idField={'invoice_number'}
          itemAvatar={(invoice) => {
            const Icon = concept_icons[invoice.concept] || React.Fragment
            return <Icon />
          }}
          itemHeader={(invoice) => (
            <Box
              sx={{
                display: 'flex',
                flex: 'inline',
                justifyContent: 'space-between',
                fontWeight: 550,
              }}
            >
              <span>{`Factura ${invoice.invoice_number}`}</span>
              <span>{`${format.euros(invoice.amount)}`}</span>
            </Box>
          )}
          itemBody={(invoice) => (
            <>
              <Box sx={{ display: 'flex', flex: 'inline', justifyContent: 'space-between' }} >
                <span>{`${format.date(invoice.emission_date)}`}</span>
                <span>
                  <PaymentIcon payment_status={invoice.payment_status} />
                </span>
              </Box>
              <Box sx={{ display: 'flex', flex: 'inline', justifyContent: 'space-between' }} >
                <span>{`${t('INVOICES.COLUMN_CONTRACT')}: ${invoice.contract_number}`}</span>
              </Box>
              <Box sx={{ display: 'flex', flex: 'inline', justifyContent: 'space-between' }} >
                <span>{`${t('INVOICES.COLUMN_CONCEPT')}: ${format.enumeration(invoice.concept, concept_options)}`}</span>
              </Box>
              <Box sx={{ display: 'flex', flex: 'inline', justifyContent: 'space-between' }} >
                <span sx={{ whiteSpace: 'nowrap' }}>
                  {`${t('INVOICES.COLUMN_PERIOD')}: ${format.date(
                    invoice.first_period_date,
                  )} - ${format.date(invoice.last_period_date)}`}
                </span>
              </Box>
            </>
          )}
          itemActions={itemActions}
        />
      ) : (
        <TableEditor
          title={t('INVOICES.TABLE_TITLE', { n: rows.length })}
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
              <TableCell colSpan={9} sx={{ textAlign: 'center' }}>
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
