import React from "react"

import useLocalStorage from "../hooks/LocalStorage"
import ov from "../services/ovapi"
import ChangePasswordDialog from "./ChangePasswordDialog"
import { useDialog } from "./DialogProvider"
import HijackDialog from "./HijackDialog"
import LoginDialog from "./LoginDialog"

const noFunction = () => undefined

const AuthContext = React.createContext({
  login: noFunction,
  logout: noFunction,
  hijack: noFunction,
  reloadUser: noFunction,
  currentUser: null,
})

function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("user", null)
  const [openDialog, closeDialog] = useDialog()

  let currentUser = null
  try {
    currentUser = JSON.parse(user)
  } catch (e) {
    console.error("Parsing user info", e)
  }
  const setCurrentUser = (user) => setUser(JSON.stringify(user))
  const reloadUser = () => {
    ov.currentUser().then((user) => setCurrentUser(user))
  }

  const login = React.useCallback(() => {
    openDialog({
      children: (
        <LoginDialog
          closeDialog={() => {
            closeDialog()
            reloadUser()
          }}
        />
      ),
    })
  }, [])

  const logout = React.useCallback(() => {
    setUser(null)
    ov.logout()
  }, [])

  const hijack = React.useCallback(() => {
    openDialog({
      children: (
        <HijackDialog
          closeDialog={() => {
            closeDialog()
            reloadUser()
          }}
        />
      ),
    })
  }, [])

  const changePassword = React.useCallback(() => {
    openDialog({
      children: (
        <ChangePasswordDialog
          closeDialog={() => {
            closeDialog()
          }}
        />
      ),
    })
  }, [])

  React.useEffect(() => {
    reloadUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        reloadUser,
        currentUser,
        changePassword,
        hijack,
      }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => React.useContext(AuthContext)

export { AuthProvider, useAuth }
export default AuthProvider
