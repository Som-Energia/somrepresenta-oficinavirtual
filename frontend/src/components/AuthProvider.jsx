import React from 'react'
//import AuthProvider, {AuthContext} from './AuthProviderDummy'
import AuthProvider, { AuthContext } from './AuthProviderOauth2'

const useAuth = () => React.useContext(AuthContext)

export { AuthContext, useAuth }
export default AuthProvider
