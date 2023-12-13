
import React from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import koFirefly from '../assets/cuca-marejada.svg'
import { useNavigate } from 'react-router-dom'

export default function ErrorSplash({
  message,
  backlink,
  backtext,
}) {
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Typography variant="h4">{message}</Typography>
      <img
        src={koFirefly}
        style={{
          maxHeight: '10rem',
          marginBlock: '2rem',
        }}
      />
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Button variant="contained" color="primary" onClick={() => navigate(backlink)}>
          {backtext}
        </Button>
      </Box>
    </Box>
  )
}
