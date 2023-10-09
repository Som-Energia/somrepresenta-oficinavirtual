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
import AppFrame from '../components/AppFrame'

// TODO: Use the theme for this
//const highlightColor = '#646cff'
const highlightColor = '#ef6c00'

function PageButton(params) {
  const { route, title, image: Image } = params
  return (
    <Card elevation={0}>
      <CardActionArea
        {...(route ? { component: Link, to: route } : {})}
        sx={{
          transition: '.2s',
          '&:hover': {
            color: highlightColor,
            transition: '.2s',
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', flexFlow: 'column', alignItems: 'center' }}>
            <Image sx={{ fontSize: 'clamp(150px, 20vw, 200px)' }} />
            <Typography variant="h5" sx={{ textAlign: 'center' }}>
              {title}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
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
    <AppFrame>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexFlow: 'row wrap',
          justifyContent: 'center',
          gap: '5%',
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
    </AppFrame>
  )
}
