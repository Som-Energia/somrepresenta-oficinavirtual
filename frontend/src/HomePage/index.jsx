import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import SolarPowerIcon from '@mui/icons-material/SolarPower'
import DescriptionIcon from '@mui/icons-material/Description'
import QueryStatsIcon from '@mui/icons-material/QueryStats'

function PageButton(params) {
  const { route, title, image: Image } = params
  return (
    <Box sx={{ display: 'flex', flexFlow: 'column', alignItems: 'center' }}>
      <Box
        sx={{
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          borderRadius: '50%',
          marginTop: '1.5rem',
          marginBottom: '1.5rem',
          height: 'clamp(150px,  15vw, 200px)',
          width: 'clamp(150px, 15vw, 200px)',
          transition: '.2s',
          '&:hover': {
            backgroundColor: 'secondary.main',
            color: 'primary.main',
            transition: '.2s',
          },
        }}
      >
        <Link
          to={route}
          style={{
            color: 'inherit',
          }}
        >
          <Image
            sx={{
              fontSize: 'clamp(150px, 15vw, 200px)',
              padding: '15%',
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
export default function HomePage(params) {
  const { t, i18n } = useTranslation()
  // TODO: replicated in AppFrame
  const pages = [
    {
      text: t('APP_FRAME.PAGE_INSTALLATIONS'),
      icon: SolarPowerIcon,
      path: '/install',
    },
    {
      text: t('APP_FRAME.PAGE_INVOICES'),
      icon: DescriptionIcon,
      path: '/invoices',
    },
    {
      text: t('APP_FRAME.PAGE_PRODUCTION_DATA'),
      icon: QueryStatsIcon,
      path: '/production',
    },
  ]
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'center',
        gap: '10%',
        p: 3,
      }}
    >
      {pages.map((page) => (
        <PageButton
          key={page.path}
          title={page.text}
          route={page.path}
          image={page.icon}
        />
      ))}
    </Box>
  )
}
