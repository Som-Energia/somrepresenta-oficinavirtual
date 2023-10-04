// ProfileButton
// The button in the toolbar that enables login when logged out
// and access to profile options when logged in.
import * as React from 'react'

import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import IconSettings from '@mui/icons-material/Settings'
import IconLogout from '@mui/icons-material/Logout'
import { useTranslation } from 'react-i18next'
import { AuthContext } from './AuthProvider'

function ProfileButton() {
  const { t, i18n } = useTranslation()
  const {currentUser, login, logout} = React.useContext(AuthContext)
  console.log({currentUser})

  const [anchorElUser, setAnchorElUser] = React.useState(null)
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }
  const menuProfile = [
    {
      text: t('APP_FRAME.MENU_PROFILE'),
      icon: <IconSettings />,
      /*
      onclick: () => {
        editPerson(Auth.username())
      },
      */
    },
    {
      text: t('APP_FRAME.MENU_LOGOUT'),
      icon: <IconLogout />,
      onclick: logout,
    },
  ]
  
  return (
    <Box sx={{ flexGrow: 0 }}>
      {currentUser !== null ? (
        <>
          <Tooltip title={t('APP_FRAME.PROFILE_TOOLTIP')}>
            <IconButton
              onClick={handleOpenUserMenu}
              sx={{
                p: 0,
              }}
            >
              <Avatar
                alt={currentUser.initials}
                src={currentUser.avatar}
              >
                {currentUser.initials}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{
              mt: '45px',
            }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={handleCloseUserMenu}>
              <ListItemIcon>
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                  }}
                />
              </ListItemIcon>
              {currentUser.name}
            </MenuItem>
            <Divider />
            {menuProfile.map((option, i) => (
              <MenuItem
                key={i}
                onClick={() => {
                  handleCloseUserMenu()
                  option.onclick && option.onclick()
                }}
              >
                <ListItemIcon>{option.icon}</ListItemIcon>
                <Typography textAlign="center">{option.text}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </>
      ) : (
        <Button variant="contained" onClick={login}>
          {t("APP_FRAME.LOGIN")}
        </Button>
      )}
    </Box>
  )
}

export default ProfileButton
