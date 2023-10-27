import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useNavigate, useLocation } from 'react-router-dom'

const drawerWidth = 240

export default function ClippedDrawer({ sx, items }) {
  const navigate = useNavigate()
  const currentLocation = useLocation()

  return (
    <Drawer
      variant="permanent"
      sx={{
        ...sx,
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {items.map((page, i) => {
            const Icon = page.icon
            return (
              <ListItemButton
                key={i + ''}
                onClick={() => {
                  navigate(page.path)
                }}
                selected={page.path === currentLocation.pathname}
              >
                <ListItemIcon>
                  <Icon />
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
