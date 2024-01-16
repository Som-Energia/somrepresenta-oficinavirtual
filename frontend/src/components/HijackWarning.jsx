import React, {useState, useEffect} from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import useLocalStorage from '../hooks/LocalStorage'


function HijackWarning (params){
  const [hijacked, setHijacked] = useLocalStorage('hijacked', true)
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(true)
  useEffect(() => {
    console.log(hijacked)
  }, [hijacked])
  function handleClose () {
    setHijacked(false)
  }
    return hijacked && (
      <div style={{position: 'fixed', bottom: '30px', right: '20px'}}>
    <Box component="section" sx={{ p: 2, border: '1px solid black', backgroundColor: 'lightgrey' }}>
      Modo suplantación activado
      <Button onClick={handleClose}>AAAH</Button>
    </Box>
      </div>
    );
}
export default HijackWarning
