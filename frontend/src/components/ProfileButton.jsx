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
import IconKey from '@mui/icons-material/Key'
import IconLogout from '@mui/icons-material/Logout'
import IconLogin from '@mui/icons-material/Login'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'

function ProfileButton(params) {
  const { t, i18n } = useTranslation()
  const { currentUser, login, logout, changePassword } = useAuth()
  const navigate = useNavigate()

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
      onclick: () => {
        navigate('/profile')
      },
    },
    {
      text: t('APP_FRAME.MENU_CHANGE_PASSWORD'),
      icon: <IconKey />,
      onclick: changePassword,
      hidden: changePassword === undefined,
    },
    {
      text: t('APP_FRAME.MENU_LOGOUT'),
      icon: <IconLogout />,
      onclick: logout,
    },
  ]

  const initials = (name) =>
    name
      .split('')
      .filter((l) => l.trim().toUpperCase() === l)
      .slice(0, 2)
      .join('')

  return (
    <Box {...params}>
      {currentUser !== null ? (
        <>
          <Tooltip title={t('APP_FRAME.PROFILE_TOOLTIP')}>
            <Button
              variant="contained"
              onClick={handleOpenUserMenu}
              sx={{
                p: 0,
                pr: 1,
                color: (theme) => theme.palette.primary.contrastText,
                bgcolor: (theme) => theme.palette.primary.main,
              }}
            >
              <Avatar
                alt={initials(currentUser.name)}
                src={currentUser.avatar}
                sx={{
                  bgcolor: (theme) => theme.palette.primary.contrastText,
                  color: (theme) => theme.palette.primary.main,
                }}
              >
                {currentUser.initials}
              </Avatar>
              <Box
                sx={{
                  marginInlineStart: 1,
                  display: {
                    xs: 'none',
                    sm: 'inherit',
                  },
                }}
              >
                {currentUser.name}
              </Box>
            </Button>
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
            {menuProfile.map(
              (option, i) =>
                !option.hidden && (
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
                ),
            )}
          </Menu>
        </>
      ) : (
        <>
          <Button
            variant="contained"
            onClick={login}
            sx={{
              display: {
                xs: 'none',
                sm: 'inherit',
              },
            }}
          >
            {t('APP_FRAME.LOGIN')}
          </Button>
          <IconButton
            color={'inherit'}
            onClick={login}
            sx={{
              ...(params.sx ?? {}),
              display: {
                xs: 'inherit',
                sm: 'none',
              },
            }}
            title={t('APP_FRAME.LOGIN')}
          >
            <IconLogin />
          </IconButton>
        </>
      )}
    </Box>
  )
}

export default ProfileButton
