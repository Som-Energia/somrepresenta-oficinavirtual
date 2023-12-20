import React from 'react'
import { useAuth } from './AuthProvider'
import ovapi from '../services/ovapi'

const InstallationContext = React.createContext()

export default function InstallationProvider({ children }) {
  const { currentUser } = useAuth()

  const getInstallations = () => {
    return ovapi.installations(currentUser)
      .then((data) => {
        // setInstallations(data);
        // setLoading(false);
        console.log(data);
        return data;
      })
      .catch((error) => {
        console.error(error);
        // setLoading(false);
        // throw error;
      });
  };

  const contextValue = getInstallations()

  return (
    <InstallationContext.Provider value={contextValue}>
      {children}
    </InstallationContext.Provider>
  )
}

export const useInstallationContext = () => React.useContext(InstallationContext)
