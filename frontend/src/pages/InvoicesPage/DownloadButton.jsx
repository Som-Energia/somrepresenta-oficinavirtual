import React from 'react'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import CheckIcon from '@mui/icons-material/Check'
import ErrorIcon from '@mui/icons-material/Error'
import ovapi from '../../services/ovapi'

const idle = 'idle'
const done = 'done'
const inprogress = 'inprogress'

export default function DownloadButton({ context }) {
  const [state, setState] = React.useState(idle)
  const [error, setError] = React.useState(undefined)

  async function onDownloadPdf() {
    setState(inprogress)
    setError(undefined)
    try {
      await ovapi.invoicePdf(context.invoice_number)
      setState(done)
    } catch (e) {
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

  return (
    <IconButton
      size="small"
      onClick={handleClick}
      {...(state === done
        ? {
            color: error ? 'error' : 'success',
          }
        : null)}
    >
      {state === idle ? (
        <PictureAsPdfIcon />
      ) : state == inprogress ? (
        <CircularProgress size={24} />
      ) : error ? (
        <ErrorIcon />
      ) : (
        <CheckIcon />
      )}
    </IconButton>
  )
}
