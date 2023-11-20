/*
Reload the application whenever a new API version is detected.

Checks periodically the api version against the ui version (in package.json).
If they are different shows countdown to force a reload.

While in countdown mode children are blocked.
You can use it as a container to block interface,
or just as an empty element and display the rest of the ui
under the backdrop.

Required Contexts:
*/

import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import MuiMarkdown from 'mui-markdown'
import { useTranslation } from 'react-i18next'
import ov from '../services/ovapi'
import useAplicationMetadata from '../hooks/ApplicationMetadata'

// TODO: Into a configuration file, use those as defaults
const RELOAD_TIMEOUT_SECONDS = 10
const CHECK_TIMEOUT_SECONDS = 60 * 10
const MILLISECONDS_IN_SECOND = 1000

function forcedReload() {
  const bypassCache = true
  window.location.reload(bypassCache)
}

let apiVersion = null
let onApiVersionUpdated = null

async function obtainApiVersion() {
  try {
    apiVersion = await ov.version()
    if (onApiVersionUpdated) onApiVersionUpdated()
  } catch (e) {
    console.error('version check failed', e)
  }
  const timer = setTimeout(() => {
    console.log('programed obtainApiVersion')
    obtainApiVersion()
  }, MILLISECONDS_IN_SECOND * CHECK_TIMEOUT_SECONDS)
}
obtainApiVersion()

function VersionCheck({ children }) {
  const { version: uiVersion, title } = useAplicationMetadata()
  const [reloadTime, setReloadTime] = React.useState(null)
  const [seconds, setSeconds] = React.useState(null)
  const { t, i18n } = useTranslation()

  onApiVersionUpdated = () => {
    if (!apiVersion) return // API version still not received
    if (apiVersion === uiVersion) return // API version matches
    if (reloadTime !== null) return // Count down already started

    console.error(`Version missmatch detected: ui ${uiVersion} !=== api ${apiVersion}`)
    let time = new Date()
    time.setSeconds(time.getSeconds() + RELOAD_TIMEOUT_SECONDS)
    setReloadTime(time)
    setTimeout(() => forcedReload(), RELOAD_TIMEOUT_SECONDS * MILLISECONDS_IN_SECOND)
    setSeconds(RELOAD_TIMEOUT_SECONDS)
    setInterval(() => setSeconds((s) => (s ? s - 1 : 0)), MILLISECONDS_IN_SECOND)
  }

  if (seconds === null) return children
  return (
    <>
      <Dialog open>
        <DialogTitle>{t('VERSION_CHECKER.NEW_VERSION_DETECTED_TITLE')}</DialogTitle>
        <DialogContent>
          <MuiMarkdown>
            {t('VERSION_CHECKER.NEW_VERSION_DETECTED_MARKDOWN', {
              uiVersion,
              apiVersion,
              title,
            })}
          </MuiMarkdown>
        </DialogContent>
        <DialogActions>
          <Typography style={{ marginInline: '2rem' }}>
            {seconds
              ? t('VERSION_CHECKER.RELOADING_IN', { seconds })
              : t('VERSION_CHECKER.RELOADING')}
          </Typography>
          <Button variant="contained" color="primary" onClick={forcedReload}>
            {t('VERSION_CHECKER.RELOAD_NOW')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default VersionCheck
