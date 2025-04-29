import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTranslation } from 'react-i18next'
import ProfileButton from './ProfileButton'
import ColorModeButton from './ColorModeButton'
import LanguageMenu from './LanguageMenu'
import ClippedDrawer from './ClippedDrawer'
import Footer from './Footer'
import useAplicationMetadata from '../hooks/ApplicationMetadata'

export default function AppFrame(props) {
  const { children } = props
  const [isDrawerOpen, openDrawer] = React.useState(false)
  const { title, subtitle, logo, menuPages } = useAplicationMetadata()
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))

  // TODO: Move styling to the global style
  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, borderRadius:'8px', margin: '0.5rem' }}
        enableColorOnDark
      >
        <Toolbar>
          {/* Page selector for small devices */}
          <IconButton
            id="drawer-button"
            aria-label={t('APP_FRAME.SECTIONS')}
            aria-controls="drawer"
            color="inherit"
            onClick={() => openDrawer((wasOpen) => !wasOpen)}
            edge="start"
            sx={{
              display: {
                xs: 'inline',
                sm: 'none',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          {/* Logo */}
          <img src={logo} width="64px" style={{ marginInline: '1rem' }} />

          {/* App name */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', flexGrow: 1, gap: '0 0.4rem' }}>
            <Typography
              variant="pagetitle"
              component="div"
              sx={{
                color: 'pagetitle.main',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="pagesubtitle"
              component="div"
              sx={{
                color: 'pagetitle.main',
              }}
            >
              {subtitle}
            </Typography>
          </Box>

          {/* Tool buttons */}
          {isXs ? null : (
            <>
              <ProfileButton sx={{ flexGrow: 1 }} />
              <ColorModeButton />
              <LanguageMenu />
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex' }}>
        <ClippedDrawer
          open={isDrawerOpen}
          onClose={() => openDrawer(false)}
          items={menuPages}
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
