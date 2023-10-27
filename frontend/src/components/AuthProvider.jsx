import React from 'react'
console.log(import.meta.env)
const configuredBackend = import.meta.env.VITE_AUTH_BACKEND ?? 'Oauth2'

const backends = import.meta.globEager('./AuthProvider?*.jsx')
console.log({ backends })
const selectableBackends = Object.fromEntries(
  Object.keys(backends).map((key) => {
    const code = key.slice('./AuthProvider'.length, -'.jsx'.length)
    return [code, backends[key]]
  }),
)
console.log({ selectableBackends })
console.log({ configuredBackend })

//const { AuthProvider, useAuth } = import(`./AuthProvider${configuredBackend}.jsx`)
const { AuthProvider, useAuth } = selectableBackends[configuredBackend]
console.log({ AuthProvider, useAuth })

export { useAuth }
export default AuthProvider
