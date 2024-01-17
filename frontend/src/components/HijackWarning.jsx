import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconLogout from '@mui/icons-material/Logout'
import { useTranslation } from 'react-i18next'
import { useCookies } from 'react-cookie'
import { useAuth } from './AuthProvider'

function HijackWarning() {
  const { t, i18n } = useTranslation()
  const { logout } = useAuth()
  const [open, setOpen] = useState(true)
  const [cookies, setCookie, removeCookie] = useCookies(['Hijacked'])

  useEffect(() => {
    setOpen(cookies['Hijacked'])
  }, [cookies])

  function handleClose() {
    setCookie('Hijacked', false)
    logout()
  }

  return (
    open && (
      <div style={{ position: 'fixed', bottom: '30px', right: '20px' }}>
        <Box
          component="section"
          sx={{
            p: 2,
            backgroundColor: 'lightgrey',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            size: 'large'
          }}
        >
          Modo suplantación activado
          <Button variant="contained" startIcon={<IconLogout />}
            style={{
              backgroundColor: 'grey',
              marginTop: '8px',
            }}
            onClick={handleClose}>Salir</Button>
        </Box>
      </div>
    )
  )
}
export default HijackWarning
