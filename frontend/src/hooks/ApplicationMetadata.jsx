import React from 'react'
import HomeIcon from '@mui/icons-material/Home'
import SolarPowerIcon from '@mui/icons-material/SolarPower'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import DescriptionIcon from '@mui/icons-material/Description'
import { useTranslation } from 'react-i18next'
import appData from '../data/appdata.yaml'

// TODO: Solve this, still have to list the icons in the yaml
const icons = {
  Home: HomeIcon,
  SolarPower: SolarPowerIcon,
  Description: DescriptionIcon,
  QueryStats: QueryStatsIcon,
}

// Made a hook, since it should be called always within a component

export default function useApplicationMetadata() {
  const { t, i18n } = useTranslation()
  const title = t('APP_FRAME.APPLICATION_TITLE')
  const subtitle = t('APP_FRAME.APPLICATION_SUBTITLE')
  const menuPages = appData.menuPages.map((page) => {
    return {
      path: page.path,
      text: t(page.text),
      icon: icons[page.icon],
    }
  })
  return {
    ...appData,
    version: __APP_VERSION__,
    title,
    subtitle,
    menuPages,
  }
}
