import React from "react"
import { useTranslation } from "react-i18next"

import CheckIcon from "@mui/icons-material/Check"
import DownloadIcon from "@mui/icons-material/Download"
import ErrorIcon from "@mui/icons-material/Error"
import CircularProgress from "@mui/material/CircularProgress"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"

import messages from "../../services/messages"

// States
const idle = "idle"
const done = "done"
const inprogress = "inprogress"

export default function DownloadButton({
  context,
  title,
  action,
  size = "small",
  Icon = DownloadIcon,
}) {
  const { t } = useTranslation()
  const [state, setState] = React.useState(idle)
  const [error, setError] = React.useState(undefined)

  async function download() {
    setState(inprogress)
    setError(undefined)
    try {
      await action(context)
      setState(done)
    } catch (error) {
      setState(done)
      setError(error)
      messages.error(error.error, { context: "Downloading" })
    }
  }
  async function handleClick(ev) {
    ev.stopPropagation()
    if (state === inprogress) return
    if (state === idle) return await download()
    setState(idle)
    setError(undefined)
  }

  const tooltip =
    state === idle
      ? (title ?? t("INVOICES.DOWNLOAD_TOOLTIP_DOWNLOAD"))
      : state === inprogress
        ? t("INVOICES.DOWNLOAD_TOOLTIP_ONGOING")
        : error
          ? error.error
          : t("INVOICES.DOWNLOAD_TOOLTIP_SUCCESS")

  const color = state !== done ? "default" : error ? "error" : "success"

  return (
    <Tooltip title={tooltip} sx={{ backgroundColor: color }}>
      <IconButton size={size} onClick={handleClick} {...{ color }}>
        {state === idle ? (
          <Icon fontSize="inherit" />
        ) : state === inprogress ? (
          <CircularProgress size={size === "small" ? 18 : 24} />
        ) : error ? (
          <ErrorIcon fontSize="inherit" />
        ) : (
          <CheckIcon fontSize="inherit" />
        )}
      </IconButton>
    </Tooltip>
  )
}
