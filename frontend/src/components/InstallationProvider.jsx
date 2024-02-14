import React, { useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useAuth } from './AuthProvider'
import ovapi from '../services/ovapi'

const InstallationContext = React.createContext()

const InstallationContextProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [installations, setInstallations] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getInstallations = async () => {
      setLoading(true)
      try {
        const installationsData = await ovapi.installations(currentUser)
        setInstallations(installationsData)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    getInstallations()
  }, [currentUser])

  const contextValue = useMemo(
    () => ({ installations, loading, error }),
    [installations, loading, error],
  )

  return (
    <InstallationContext.Provider value={contextValue}>
      {children}
    </InstallationContext.Provider>
  )
}

InstallationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export { InstallationContext, InstallationContextProvider }
