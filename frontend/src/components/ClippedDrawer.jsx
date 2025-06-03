import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useNavigate, useLocation } from 'react-router-dom'
import LanguageMenu from './LanguageMenu'
import ProfileButton from './ProfileButton'

const drawerWidth = 240

export default function ClippedDrawer({ sx, open, onClose, items }) {
  const navigate = useNavigate()
  const currentLocation = useLocation()
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))

  // Whenever we exit xs breakpoint, close temporary drawer
  React.useEffect(() => {
    if (!isXs && open) {
      onClose()
    }
  }, [isXs])

  return (
    <Drawer
      id="drawer"
      variant={isXs ? 'temporary' : 'permanent'}
      sx={{
        ...sx,
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
      anchor="left"
      open={open}
      onClose={onClose}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {isXs ? (
            <>
              <ListItem
                sx={{
                  display: 'flex wrap',
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <ProfileButton onMenuClose={onClose} />
                <LanguageMenu />
              </ListItem>
              <Divider />
            </>
          ) : null}
          {items.map((page, i) => {
            if (page.dev && import.meta.env.MODE !== 'development') return
            const Icon = page.icon
            return (
              <ListItemButton
                key={i + ''}
                onClick={() => {
                  navigate(page.path)
                  onClose()
                }}
                selected={page.path === currentLocation.pathname}
                sx={{
                  "&.Mui-selected": {
                      backgroundColor: "#E2E8DE"
                  }
                }}
              >
                <ListItemIcon>
                  <Icon
                    sx={{
                      '&:hover': {
                        fill: '#B5EA62',
                      },
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary={page.text} />
              </ListItemButton>
            )
          })}
        </List>
      </Box>
    </Drawer>
  )
}
