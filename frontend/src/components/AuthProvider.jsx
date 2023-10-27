import React from 'react'

const configuredBackend = import.meta.env.VITE_AUTH_BACKEND ?? 'Oauth2'

// TODO: This would be a better approach but does not work in build just in dev
//const { AuthProvider, useAuth } = import(`./AuthProvider${configuredBackend}.jsx`)

const backends = import.meta.globEager('./AuthProvider?*.jsx')
const selectableBackends = Object.fromEntries(
  Object.keys(backends).map((key) => {
    const code = key.slice('./AuthProvider'.length, -'.jsx'.length)
    return [code, backends[key]]
  }),
)
const { AuthProvider, useAuth } = selectableBackends[configuredBackend]

export { useAuth }
export default AuthProvider
