import React from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import CheckIcon from '@mui/icons-material/Check'
import ErrorIcon from '@mui/icons-material/Error'
import { useTranslation } from 'react-i18next'
import ovapi from '../../services/ovapi'

// States
const idle = 'idle'
const done = 'done'
const inprogress = 'inprogress'

export default function DownloadButton({ context, title, size='small' }) {
  const { t } = useTranslation()
  const [state, setState] = React.useState(idle)
  const [error, setError] = React.useState(undefined)

  async function onDownloadPdf() {
    setState(inprogress)
    setError(undefined)
    try {
      await ovapi.invoicePdf(context.invoice_number)
      setState(done)
    } catch (error) {
      setState(done)
      setError(error)
    }
  }
  async function handleClick(ev) {
    ev.stopPropagation()
    if (state === inprogress) return
    if (state === idle) return await onDownloadPdf()
    setState(idle)
    setError(undefined)
  }

  const tooltip =
    state === idle
      ? title ?? t('INVOICES.DOWNLOAD_TOOLTIP_DOWNLOAD')
      : state === inprogress
        ? t('INVOICES.DOWNLOAD_TOOLTIP_ONGOING')
        : error
          ? error.error
          : t('INVOICES.DOWNLOAD_TOOLTIP_SUCCESS')

  const color = state !== done ? 'default' : error ? 'error' : 'success'

  return (
    <Tooltip title={tooltip} sx={{ backgroundColor: color }}>
      <IconButton size={size} onClick={handleClick} {...{ color }}>
        {state === idle ? (
          <PictureAsPdfIcon fontSize="inherit"/>
        ) : state == inprogress ? (
          <CircularProgress size={size==='small'?18:24} />
        ) : error ? (
          <ErrorIcon  fontSize="inherit"/>
        ) : (
          <CheckIcon fontSize="inherit" />
        )}
      </IconButton>
    </Tooltip>
  )
}
