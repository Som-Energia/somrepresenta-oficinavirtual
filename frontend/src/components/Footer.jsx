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
      text: t('FOOTER.WEB'),
      url: 'https://somenergia.coop',
    },
    {
      text: t('FOOTER.BLOG'),
      url: 'https://blog.somenergia.coop',
    },
    {
      text: t('FOOTER.HELP_CENTER'),
      url: t('FOOTER.HELP_CENTER_URL'),
    },
    {
      text: t('FOOTER.DISCLAIMER'),
      url: t('FOOTER.DISCLAIMER_URL'),
    },
    {
      text: t('FOOTER.PRIVACY_POLICY'),
      url: t('FOOTER.PRIVACY_POLICY_URL'),
    },
    {
      text: t('FOOTER.COOKIE_POLICY'),
      url: `#/cookies_policy/`,
    },
  ]
  return (
    <Paper
      color="primary"
      elevation={3}
      sx={{
        ...sx,
        backgroundColor: 'secondary.main',
        color: 'secondary.contrastText',
        padding: '1rem',
        mt: '2rem',
      }}
    >
      <Container>
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'row wrap',
            gap: '0 2rem',
            justifyContent: 'center',
          }}
        >
          {footerItems.map((item) => (
            <Button
              key={item.text}
              href={item.url}
              size="small"
              target="_blank"
              sx={{ color: 'secondary.dark' }}
            >
              {item.text}
            </Button>
          ))}
        </Box>
      </Container>
    </Paper>
  )
}
