/*
Checks in intervals the api version against
the ui version and if they are different
shows count down to force reload the page.
*/

import React from 'react'
import Container from '@mui/material/Container'
import { useTranslation } from 'react-i18next'
import ov from '../services/ovapi'
import useAplicationMetadata from '../hooks/ApplicationMetadata'

const RELOAD_TIMEOUT_SECONDS = 10
const CHECK_TIMEOUT_SECONDS = 5
const MILLISECONDS_IN_SECOND = 1000

function forcedReload() {
  const bypassCache = true
  window.location.reload(bypassCache)
}

const firstVersion = await ov.version()
const versionObservers = []
function subscribeToApiVersion(o) {
    versionObservers.push(o)
}

function VersionCheck({ children }) {
  const { version: uiVersion } = useAplicationMetadata()
  const [apiVersion, setApiVersion] = React.useState(firstVersion)
  const [seconds, setSeconds] = React.useState(null)
  const { t, i18n } = useTranslation()
  const apiVersion = React.useSyncExternalSource(
    ()=> {
      versionObservers.push(

  console.debug('render', { seconds, uiVersion })

  React.useEffect(() => {
    console.debug('useEffect', { seconds, uiVersion })
    const timer = setInterval(() => {
      if (seconds !== null) return
      checkVersion()
    }, MILLISECONDS_IN_SECOND * CHECK_TIMEOUT_SECONDS)
    console.log('Creating timer', timer)
    return () => {
      console.log('Clearing', timer)
      clearTimeout(timer)
    }
  }, [])

  if (seconds === null) return children
  return (
    <Container>
      <h1>Version missmatch</h1>
      <p>
        {t(
          'Detected version missmatch between server ({{apiVersion}}) and browser ({{uiVersion}})',
          { apiVersion, uiVersion },
        )}
      </p>
      <p>Reloading in {seconds} seconds</p>
    </Container>
  )

  async function checkVersion() {
    const retrievedVersion = await ov.version()
    console.log({ retrievedVersion, uiVersion, seconds })
    if (seconds !== null) return // already reloading
    if (!retrievedVersion) return // error retrieving version, ignore
    if (retrievedVersion == uiVersion) return // no version change

    console.log('Scheduling reload', { seconds, retrievedVersion })
    setApiVersion(retrievedVersion)
    scheduleReload()
  }

  function scheduleReload() {
    if (seconds !== null) {
      return
    }
    setSeconds(RELOAD_TIMEOUT_SECONDS)
    const timer = setInterval(() => {
      setSeconds((s) => {
        console.log('Timer', s, seconds)
        if (s > 0) return s - 1
        clearInterval(timer)
        forcedReload()
        return s
      })
    }, 1 * MILLISECONDS_IN_SECOND)
  }
}

export default VersionCheck
