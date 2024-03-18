import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

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

import PageTitle from '../../components/PageTitle'
import Loading from '../../components/Loading'
import ErrorSplash from '../../components/ErrorSplash'
import { useAuth } from '../../components/AuthProvider'
import DownloadButton from './DownloadButton'
import MultiItemView from './MultiItemView'

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
  open: ScheduleIcon,
}

function PaymentStatus({ payment_status }) {
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
    }[payment_status] || ScheduleIcon
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
        {...{
          'aria-description': format.enumeration(payment_status, payment_status_options),
        }}
      />
    </>
  )
}

function ContentRow({ children, ...props }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={1} {...props}>
      {children}
    </Stack>
  )
}

function PaymentStatusCell({ payment_status }) {
  const { t } = useTranslation()
  const color =
    {
      paid: 'success.main',
      open: 'warning.main',
      unpaid: 'error.main',
    }[payment_status] || 'warning.main'
  const Icon =
    {
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

PaymentStatusCell.propTypes = {
  payment_status: PropTypes.oneOf(['paid', 'open', 'unpaid']).isRequired,
}

export default function InvoicesPage() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = React.useState(true)
  const [rows, setRows] = React.useState([])
  const [error, setError] = React.useState(false)
  const { currentUser } = useAuth()
  const isPaymentEnabled = import.meta.env.VITE_ENABLE_INVOICE_PAYMENT == false
  const tableBreakPoint = 'md'
  const theme = useTheme()
  const useList = useMediaQuery(theme.breakpoints.down(tableBreakPoint))

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
      view: (invoice) => <PaymentStatusCell payment_status={invoice.payment_status} />,
    },
  ]
  const actions = []
  const selectionActions = [
    {
      title: t('INVOICES.TOOLTIP_DOWNLOAD_ZIP'),
      icon: <DownloadIcon />,
      view: (invoices) => (
        <DownloadButton
          size={'large'}
          context={invoices}
          Icon={DownloadIcon}
          title={t('INVOICES.TOOLTIP_DOWNLOAD_ZIP')}
          action={(invoices) => ovapi.invoicesZip(invoices)}
        />
      ),
    },
  ]
  const itemActions = [
    {
      title: t('INVOICES.TOOLTIP_PDF'),
      icon: <PictureAsPdfIcon />,
      view: (invoice) => (
        <DownloadButton
          size={useList ? 'large' : 'small'}
          context={invoice}
          Icon={PictureAsPdfIcon}
          title={t('INVOICES.TOOLTIP_PDF')}
          action={(invoice) => ovapi.invoicePdf(invoice.invoice_number)}
        />
      ),
    },
  ]
  if (isLoading) return <Loading />
  if (error)
    return (
      <Container>
        <PageTitle Icon={DescriptionIcon}>{t('INVOICES.INVOICES_TITLE')}</PageTitle>
        <ErrorSplash
          title={error.context}
          message={error.error}
          backaction={() => getInvoices()}
          backtext={t('INVOICES.RELOAD')}
        />
      </Container>
    )
  return (
    <Container>
      <PageTitle Icon={DescriptionIcon}>{t('INVOICES.INVOICES_TITLE')}</PageTitle>
      <MultiItemView
        title={t('INVOICES.TABLE_TITLE', { n: rows.length })}
        defaultPageSize={12}
        pageSizes={[]}
        columns={columns}
        rows={rows}
        actions={actions}
        selectionActions={selectionActions}
        itemActions={itemActions}
        idField={'invoice_number'}
        isLoading={isLoading}
        itemAvatar={(invoice) => {
          const Icon = concept_icons[invoice.concept] || React.Fragment
          return <Icon />
        }}
        itemHeader={(invoice) => [[
          `Factura ${invoice.invoice_number}`,
          `${format.euros(invoice.amount)}`,
        ]]}
        itemBody={(invoice) => [
          [
            `${format.date(invoice.emission_date)}`,
            <PaymentStatus payment_status={invoice.payment_status} />,
          ],
          `${t('INVOICES.COLUMN_CONTRACT')}: ${invoice.contract_number}`,
          `${t('INVOICES.COLUMN_CONCEPT')}: ${format.enumeration(invoice.concept, concept_options)}`,
          <span sx={{ whiteSpace: 'nowrap' }}>
            {`${t('INVOICES.COLUMN_PERIOD')}: ${format.date(
              invoice.first_period_date,
            )} - ${format.date(invoice.last_period_date)}`}
          </span>,
        ]}
        noDataPlaceHolder={
          <Typography variant="h4">
            {t('INVOICES.NO_INVOICES')}
            <br />
            🤷‍♀️
          </Typography>
        }
      />
    </Container>
  )
}
