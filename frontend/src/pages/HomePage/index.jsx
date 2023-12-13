import React from 'react'
import Box from '@mui/material/Box'
import useAplicationMetadata from '../../hooks/ApplicationMetadata'
import PageButton from './PageButton'

export default function HomePage(params) {
  const { menuPages } = useAplicationMetadata()
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '80%',
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'center',
        alignContent: 'center',
        gap: '10%',
        p: 3,
      }}
    >
      {menuPages
        .filter((page) => page.path !== '/')
        .map((page) => (
          <PageButton
            key={page.path}
            title={page.text}
            route={page.path}
            icon={page.icon}
          />
        ))}
    </Box>
  )
}
