import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom'

const drawerWidth = 240;

export default function ClippedDrawer({sx, items}) {
  const navigate = useNavigate()
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
            {items.map((page, i) => (
              <ListItem key={i+''} disablePadding
                onClick={() => {
                  navigate(page.path)
                }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    {page.icon}
                  </ListItemIcon>
                  <ListItemText primary={page.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
  );
}
