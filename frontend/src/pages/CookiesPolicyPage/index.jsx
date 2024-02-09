import { Box, Container, Typography } from '@mui/material'
import PageTitle from '../../components/PageTitle'
import { useTranslation } from 'react-i18next'
import CookieIcon from '@mui/icons-material/Cookie'
import SimpleTable from '../../components/SimpleTable'
import CookiesReport from '../../components/CookiesReport'
import BasicTable from '../../components/BasicTable'
import {
  cookiesPolicyPurpose,
  cookiesPolicyTerm,
  cookiesPolicyOwnership,
  cookiesDescription,
  desactivateCookies,
} from './cookiesPolicyData'

export default function CookiesPolicyPage() {
  const { t } = useTranslation()

  return (
    <Container>
      <PageTitle Icon={CookieIcon}>{t('COOKIES_POLICY.TITLE')}</PageTitle>
      <Typography
        variant="subtitle1"
        sx={{ my: 3, display: 'flex', alignItems: 'center' }}
      >
        {t('COOKIES_POLICY.SUBTITLE')}
      </Typography>
      <SimpleTable
        fields={cookiesPolicyPurpose}
        translationsPrefix="COOKIES_POLICY"
        title={t('COOKIES_POLICY.TERM')}
      />
      <SimpleTable
        fields={cookiesPolicyTerm}
        translationsPrefix="COOKIES_POLICY"
        title={t('COOKIES_POLICY.OWNERSHIP')}
      />
      <SimpleTable
        fields={cookiesPolicyOwnership}
        translationsPrefix="COOKIES_POLICY"
        title={t('COOKIES_POLICY.OWNERSHIP')}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: 2, gap: 2 }}>
        <div data-cookiescriptreport="report" />
        <CookiesReport></CookiesReport>
      </Box>

      <Typography
        variant="subtitle2"
        sx={{ my: 3, mx: 3, display: 'flex', alignItems: 'center' }}
      >
        {t('COOKIES_POLICY.TABLE_DESCRIPTION')}
      </Typography>
      <SimpleTable fields={cookiesDescription} translationsPrefix="COOKIES_POLICY" />
      <Typography
        variant="subtitle2"
        sx={{ my: 3, mx: 3, display: 'flex', alignItems: 'center' }}
      >
        {t('COOKIES_POLICY.SOM_DETAILS')}
      </Typography>
      <BasicTable row={desactivateCookies}></BasicTable>
    </Container>
  )
}
