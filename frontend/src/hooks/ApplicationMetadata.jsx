import ScienceIcon from '@mui/icons-material/Science'
import {
  SolarPowerIcon,
  QueryStatsIcon,
  DescriptionIcon,
  HomeIconMenu,
  SolarPowerIconMenu,
  DescriptionIconMenu,
  QueryStatsIconMenu
} from '../assets/Icons'
import { useTranslation } from 'react-i18next'
import appData from '../data/appdata.yaml'

// TODO: Solve this, still have to list the icons in the yaml
const icons = {
  Home: HomeIconMenu,
  SolarPower: SolarPowerIcon,
  Description: DescriptionIcon,
  QueryStats: QueryStatsIcon,
  Science: ScienceIcon,
}

const iconsMenu = {
  HomeMenu: HomeIconMenu,
  SolarPowerMenu: SolarPowerIconMenu,
  DescriptionMenu: DescriptionIconMenu,
  QueryStatsMenu: QueryStatsIconMenu,
  ScienceMenu: ScienceIcon,
}

// Made a hook, since it should be called always within a component

export default function useApplicationMetadata() {
  const { t, i18n } = useTranslation()
  const title = t('APP_FRAME.APPLICATION_TITLE')
  const subtitle = t('APP_FRAME.APPLICATION_SUBTITLE')
  const menuPages = appData.menuPages.map((page) => {
    return {
      ...page,
      text: t(page.text),
      icon: icons[page.icon],
      icon_menu: iconsMenu[page.icon_menu],
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
