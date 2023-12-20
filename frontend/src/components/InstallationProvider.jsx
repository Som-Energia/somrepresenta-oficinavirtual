import React from 'react'
import { useAuth } from './AuthProvider'
import ovapi from '../services/ovapi'

const InstallationContext = React.createContext()

export default function InstallationProvider({ children }) {
  // const [installations, setInstallations] = React.useState([])
  const { currentUser } = useAuth()

  //const closeDialog = () => {
  //  setDialogs((dialogs) => {
  //    const latestDialog = dialogs.pop()
  //    if (!latestDialog) return dialogs
  //    if (latestDialog.onClose) latestDialog.onClose()
  //    return [...dialogs].concat({ ...latestDialog, open: false })
  //  })
  //}


  // const reloadUser = () => {
  //   ov.currentUser().then((user) => setCurrentUser(user))
  // }

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
  

  // const getInstallations = () => {
  //   return [1,2,3]// Use the data here or perform additional actions
  // };



  const contextValue = getInstallations()

  return (
    <InstallationContext.Provider value={contextValue}>
      {children}
    </InstallationContext.Provider>
  )
}

export const useInstallationContext = () => React.useContext(InstallationContext)
