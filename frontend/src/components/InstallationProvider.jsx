import React, { useEffect, useState, useMemo } from 'react'
import { useAuth } from './AuthProvider'
import ovapi from '../services/ovapi'

const InstallationContext = React.createContext()

const InstallationContextProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [installations, setInstallations] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const memoizedCurrentUser = useMemo(() => currentUser, [currentUser])

  useEffect(() => {
    const getInstallations = async () => {
      try {
        const installationsData = await ovapi.installations(memoizedCurrentUser)
        setInstallations(installationsData)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    getInstallations()
  }, [memoizedCurrentUser])

  return installations !== null ? (
    <InstallationContext.Provider value={{ installations, loading, error }}>
      {children}
    </InstallationContext.Provider>
  ) : null
}

export { InstallationContext, InstallationContextProvider }
