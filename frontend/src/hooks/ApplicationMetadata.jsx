import HomeIcon from '@mui/icons-material/Home'
import {
  SolarPowerIcon,
  QueryStatsIcon,
  DescriptionIcon
} from '../assets/Icons'
import ScienceIcon from '@mui/icons-material/Science'
import { useTranslation } from 'react-i18next'
import appData from '../data/appdata.yaml'

// TODO: Solve this, still have to list the icons in the yaml
const icons = {
  Home: HomeIcon,
  SolarPower: SolarPowerIcon,
  Description: DescriptionIcon,
  QueryStats: QueryStatsIcon,
  Science: ScienceIcon,
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
