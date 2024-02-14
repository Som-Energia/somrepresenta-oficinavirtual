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
    <Container
      sx={{
        '& a': { color: 'primary.main' },
        '& input[type="checkbox"]': { accentColor: '#96b633' }, // TODO: use palette instead of number color
      }}
    >
      <PageTitle Icon={CookieIcon}>{t('COOKIES_POLICY.TITLE')}</PageTitle>
      <Typography variant="h4">{t('COOKIES_POLICY.SUBTITLE')}</Typography>
      <SimpleTable
        fields={cookiesPolicyPurpose}
        translationsPrefix="COOKIES_POLICY"
        title={t('COOKIES_POLICY.PURPOSE')}
      />
      <SimpleTable
        fields={cookiesPolicyTerm}
        translationsPrefix="COOKIES_POLICY"
        title={t('COOKIES_POLICY.TERM')}
      />
      <SimpleTable
        fields={cookiesPolicyOwnership}
        translationsPrefix="COOKIES_POLICY"
        title={t('COOKIES_POLICY.OWNERSHIP')}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: 2, gap: 2 }}>
        <div data-cookiescriptreport="report" />
        <CookiesReport></CookiesReport>

        <div>
          <p>{t('COOKIES_POLICY.TABLE_DESCRIPTION')}:</p>
          <p>{t('COOKIES_POLICY.TABLE_COOKIES_CLASSIFICATION')}:</p>
        </div>
      </Box>

      <SimpleTable fields={cookiesDescription} translationsPrefix="COOKIES_POLICY" />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: 2, gap: 2 }}>
        <div>
          <p>{t('COOKIES_POLICY.SOM_COOKIES')}</p>
          <p>{t('COOKIES_POLICY.SOM_COOKIES_EXPLANATION')}</p>
          <p>{t('COOKIES_POLICY.DEACTIVATE_COOKIES_TABLE')}:</p>
        </div>

        <BasicTable row={desactivateCookies}></BasicTable>
      </Box>
    </Container>
  )
}
