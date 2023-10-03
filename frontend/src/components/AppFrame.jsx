import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ColorModeButton from './ColorModeButton'
import LanguageMenu from './LanguageMenu'
import PagesMenu from './PagesMenu'
import PagesButtons from './PagesButtons'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ScrollRestoration } from 'react-router-dom'
import ClippedDrawer from './ClippedDrawer'
import HomeIcon from '@mui/icons-material/Home'
import SolarPowerIcon from '@mui/icons-material/SolarPower'
import DescriptionIcon from '@mui/icons-material/Description'
import QueryStatsIcon from '@mui/icons-material/QueryStats'

export default function AppFrame({ children }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const title = 'Representa'
  const logo = '/logo.svg'
  const pages = [
    {
      text: t('APP_FRAME.PAGE_HOME'),
      icon: <HomeIcon />,
      path: '/',
    },
    {
      text: t('APP_FRAME.PAGE_INSTALLATIONS'),
      icon: <SolarPowerIcon />,
      path: '/install',
    },
    {
      text: t('APP_FRAME.PAGE_INVOICES'),
      icon: <DescriptionIcon />,
      path: '/invoices',
    },
    {
      text: t('APP_FRAME.PAGE_PRODUCTION_DATA'),
      icon: <QueryStatsIcon />,
      path: '/production',
    },
  ]

  // TODO: Move styling to the global style
  return (
    <>
      <ScrollRestoration /> {/* Scroll up on page switch */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        enableColorOnDark
      >
        <Toolbar>
          {/* Page selector for small devices */}
          <PagesMenu
            pages={pages}
            sx={{
              display: {
                xs: 'inline',
                sm: 'none',
              },
            }}
          />

          {/* Logo */}
          <img src={logo} width="32px" style={{ marginInline: '.5rem' }} />

          {/* App name */}
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              textTransform: 'uppercase',
            }}
          >
            {title}
          </Typography>

          {/* Page selector for bigger devices */}
          {/*
          <PagesButtons
            pages={pages}
            sx={{
              display: {
                xs: 'none',
                sm: 'inline',
              },
            }}
          />
          */}
          {/* Tool buttons */}
          <ColorModeButton />
          <LanguageMenu />
        </Toolbar>
      </AppBar>
      <ClippedDrawer
        items={pages}
        sx={{
          display: {
            xs: 'none',
            sm: 'inline',
          },
        }}
      />
      <Box sx={{ minHeight: 'calc( 100vh - 7rem )' }}>{children}</Box>
    </>
  )
}
