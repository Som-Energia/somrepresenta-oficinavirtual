import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SomofficeShell } from 'somoffice-shell'
import { BrowserRouter as Router } from "react-router-dom";

const login = () => undefined
const logout = () => undefined
const getUserInfo = () => {
  return {
    role: 'admin', // rol de la persona
    fullname: 'Bender Bending Rodríguez', // nombre completo de la persona
    language: 'es', // idioma en el que la persona verá su OV
    token: 'random-token', // token para las peticiones API
  }
}

function App() {
  const rawTheme = {
    typography: {
      fontFamily: 'Montserrat, Heletica, sansserif',
    },
  }
  const settings = {}
  const config = {
    base_url: 'http://localhost:5500', // required: url de la api donde deben hacerse las peticiones
    theme: rawTheme, // optional
    settings: settings, // optional
    logo: undefined, // TODO: check this
  }
  return (
    <>
      <Router>
        <SomofficeShell
          config={config}
          login={login}
          logout={logout}
          getUserInfo={getUserInfo}
          keycloak={{}}
          components={{}}
        ></SomofficeShell>
      </Router>
    </>
  )
}
/*
    keycloak={{ token: 'aaaaa' }} // TODO: remove this
    sections={sections} // optional
*/
export default App
