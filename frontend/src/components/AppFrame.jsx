import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import ProfileButton from './ProfileButton'
import ColorModeButton from './ColorModeButton'
import LanguageMenu from './LanguageMenu'
import PagesMenu from './PagesMenu'
import PagesButtons from './PagesButtons'
import ClippedDrawer from './ClippedDrawer'
import Footer from './Footer'
import useAplicationMetadata from '../hooks/ApplicationMetadata'

export default function AppFrame(props) {
  const { children } = props
  const { title, subtitle, logo, menuPages } = useAplicationMetadata()
  const { t, i18n } = useTranslation()

  // TODO: Move styling to the global style
  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        enableColorOnDark
      >
        <Toolbar>
          {/* Page selector for small devices */}
          <PagesMenu
            pages={menuPages}
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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', flexGrow: 1, gap: '0 0.4rem' }}>
            <Typography
              variant="pagetitle"
              component="div"
              sx={{
                textTransform: 'uppercase',
                color: 'pagetitle.main',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="pagesubtitle"
              component="div"
              sx={{
                textTransform: 'uppercase',
                color: 'pagetitle.main',
              }}
            >
              {subtitle}
            </Typography>
          </Box>

          {/* Page selector for bigger devices */}
          {/*
          <PagesButtons
            pages={menuPages}
            sx={{
              display: {
                xs: 'none',
                sm: 'inline',
              },
            }}
          />
          */}
          {/* Tool buttons */}
          <ProfileButton sx={{ flexGrow: 1 }} />
          <ColorModeButton />
          <LanguageMenu />
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex' }}>
        <ClippedDrawer
          items={menuPages}
          sx={{
            display: {
              xs: 'none',
              sm: 'inline',
            },
          }}
        />
        <Box
          sx={{
            mt: '4.5rem',
            p: 0.4,
            flexGrow: 1,
            minHeight: 'calc( 100vh - 7rem)',
          }}
        >
          {children}
        </Box>
      </Box>
      <Footer
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          position: 'relative',
        }}
      />
    </>
  )
}
