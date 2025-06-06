import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'

export default function PageButton(params) {
  const { route, title, icon: Icon } = params

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column', alignItems: 'center' }}>
      <Box
        sx={{
          color: 'primary.contrastText',
          borderRadius: '60%',
          marginTop: '1.5rem',
          marginBottom: '1.5rem',
          height: 'clamp(150px,  15vw, 200px)',
          width: 'clamp(150px, 15vw, 200px)',
          transition: '.2s',
          '&:hover': {
            color: 'primary.main',
            transform: 'translateY(-0.4rem)',
            transition: '.2s',
          },
        }}
      >
        <Link
          to={route}
          style={{
            color: 'inherit',
            display: 'block',
          }}
        >
          <Icon
            sx={{
              margin: '5px',
              fontSize: 'clamp(150px, 15vw, 200px)',
              '&:hover': {
                fill: '#B5EA62',
              },
            }}
          />
        </Link>
      </Box>
      <Typography variant="homeButtons" sx={{ textAlign: 'center' }}>
        {title}
      </Typography>
    </Box>
  )
}
