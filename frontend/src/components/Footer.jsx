import React from 'react'
import Paper from '@mui/material/Paper'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer(params) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { sx } = params

  const footerItems = [
    {
      text: t('APP_FRAME.DISCLAIMER'),
      url: t('APP_FRAME.DISCLAIMER_URL'),
    },
    {
      text: t('APP_FRAME.PRIVACY_POLICY'),
      url: t('APP_FRAME.PRIVACY_POLICY_URL'),
    },
    {
      text: 'SOM ENERGIA SCCL',
      url: 'https://somenergia.coop',
    },
  ]
  return (
    <Paper
      color="primary"
      elevation={3}
      sx={{
        ...sx,
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        padding: '1rem',
        mt: '2rem',
      }}
    >
      <Container>
       <Box sx={{ display: 'flex', flexFlow: 'row wrap', gap: 1, justifyContent: 'space-around' }}>
          {footerItems.map((item) => (
            <Button
              key={item.text}
              href={item.url}
              color="inherit"
              size="small"
              target="_blank"
            >
              <Typography variant="body1" sx={{ textTransform: 'none' }}>
                {item.text}
              </Typography>
            </Button>
          ))}
        </Box>
      </Container>
    </Paper>
  )
}
