import LightModeIcon from '@mui/icons-material/LightModeOutlined'
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined'
import AutoModeIcon from '@mui/icons-material/Brightness4'
import IconButton from '@mui/material/IconButton'
import { ColorModeContext } from './GlobalTheme'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function ColorModeButton() {
  const { t, i18n } = useTranslation()
  const { toggle, current } = React.useContext(ColorModeContext)
  const modeIcons = {
    dark: DarkModeIcon,
    light: LightModeIcon,
  }
  const Icon = modeIcons[current] || AutoModeIcon
  return (
    <>
      <IconButton
        color={'inherit'}
        aria-label={t('APP_FRAME.TOGGLE_COLOR_MODE')}
        title={t('APP_FRAME.TOGGLE_COLOR_MODE')}
        onClick={toggle}
      >
        <Icon />
      </IconButton>
    </>
  )
}
