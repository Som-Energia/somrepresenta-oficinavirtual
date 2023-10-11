import React from 'react'
console.log(import.meta.env)
const configuredBackend = import.meta.env.VITE_AUTH_BACKEND ?? 'Oauth2'

console.log({ configuredBackend })

const { AuthProvider, useAuth } = await import(`./AuthProvider${configuredBackend}.jsx`)
console.log({ AuthProvider, useAuth })

export { useAuth }
export default AuthProvider
