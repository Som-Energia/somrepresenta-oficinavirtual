import React from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'
import DownloadIcon from '@mui/icons-material/Download'
import CheckIcon from '@mui/icons-material/Check'
import ErrorIcon from '@mui/icons-material/Error'
import { useTranslation } from 'react-i18next'
import ovapi from '../../services/ovapi'

// States
const idle = 'idle'
const done = 'done'
const inprogress = 'inprogress'

export default function DownloadZipButton({ context, title }) {
  const { t } = useTranslation()
  const [state, setState] = React.useState(idle)
  const [error, setError] = React.useState(undefined)

  async function onDownloadZip() {
    setState(inprogress)
    setError(undefined)
    try {
      await ovapi.invoicesZip(context)
      setState(done)
    } catch (error) {
      setState(done)
      setError(error)
    }
  }
  async function handleClick(ev) {
    ev.stopPropagation()
    if (state === inprogress) return
    if (state === idle) return await onDownloadZip()
    setState(idle)
    setError(undefined)
  }

  const tooltip =
    state === idle
      ? title ?? t('INVOICES.TOOLTIP_DOWNLOAD_ZIP')
      : state === inprogress
        ? t('INVOICES.DOWNLOAD_TOOLTIP_ONGOING')
        : error
          ? error.error
          : t('INVOICES.DOWNLOAD_TOOLTIP_SUCCESS')

  const color = state !== done ? 'default' : error ? 'error' : 'success'

  return (
    <Tooltip title={tooltip} sx={{ backgroundColor: color }}>
      <IconButton size="small" onClick={handleClick} {...{ color }}>
        {state === idle ? (
          <DownloadIcon />
        ) : state == inprogress ? (
          <CircularProgress size={24} />
        ) : error ? (
          <ErrorIcon />
        ) : (
          <CheckIcon />
        )}
      </IconButton>
    </Tooltip>
  )
}
