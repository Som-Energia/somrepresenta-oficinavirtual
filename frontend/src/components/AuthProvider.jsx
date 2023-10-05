import React from 'react'
import useLocalStorage from '../hooks/LocalStorage'

const noFunction = () => undefined

const AuthContext = React.createContext({
  login: noFunction,
  logout: noFunction,
  currentUser: null,
})

function AuthProvider({children}) {

  const [user, setUser] = useLocalStorage('user', null)

  const login = React.useCallback(()=>{
    setUser(JSON.stringify({
      id: 'perico',
      name: 'Perico de los Palotes',
      email: 'perico@nowhere.com',
      groups: ['admin', 'staff'],
      initials: "PP",
      avatar: '/logo.svg',
    }))
  }, [])

  const logout = React.useCallback(()=>{
    setUser(null)
  }, [])

  var currentUser = null
  try {
    currentUser = JSON.parse(user)
  } catch (e) {
    console.error("Invalid user info content")
    setUser(null)
  }

  console.log({user})
  return <AuthContext.Provider value={{
    login,
    logout,
    currentUser,
  }}>
    {children}
  </AuthContext.Provider>
}

export { AuthContext }
export default AuthProvider