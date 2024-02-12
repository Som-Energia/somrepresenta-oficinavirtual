import { useTranslation as t } from 'react-i18next'

export const cookiesPolicyPurpose = {
  technical_cookies: 'COOKIES_POLICY.TECHNICAL_COOKIES_DESCRIPTION',
  customization_cookies: 'COOKIES_POLICY.CUSTOMIZATION_COOKIES_DESCRIPTION',
  analytics_cookies: 'COOKIES_POLICY.ANALYTICS_COOKIES_DESCRIPTION',
  advertising_cookies: 'COOKIES_POLICY.ADVERTISING_COOKIES_DESCRIPTION',
}

export const cookiesPolicyTerm = {
  session_cookies: 'COOKIES_POLICY.SESSION_COOKIES_DESCRIPTION',
  persistent_cookies: 'COOKIES_POLICY.PERSISTENT_COOKIES_DESCRIPTION',
}

export const cookiesPolicyOwnership = {
  own_cookies: 'COOKIES_POLICY.OWN_COOKIES_DESCRIPTION',
  thirdparty_cookies: 'COOKIES_POLICY.THIRDPARTY_COOKIES_DESCRIPTION',
}

export const cookiesDescription = {
  basic: 'COOKIES_POLICY.BASIC_DESCRIPTION',
  performance: 'COOKIES_POLICY.PERFORMANCE_DESCRIPTION',
  statistics: 'COOKIES_POLICY.STATISTICS_DESCRIPTION',
  functionality: 'COOKIES_POLICY.FUNCTIONALITY_DESCRIPTION',
}

export const cookiesSomDetails = {
  chrome: 'url',
}

function createData(name, path, url) {
  return { name, path, url }
}

export const desactivateCookies = [
  createData('Chrome', 'COOKIES_POLICY.CHROME_DESACTIVATE_COOKIES', 'support.google.com'),
  createData(
    'Firefox',
    'COOKIES_POLICY.FIREFOX_DESACTIVATE_COOKIES',
    'support.mozilla.org',
  ),
  createData(
    'Internet Explorer',
    'COOKIES_POLICY.EXPLORER_DESACTIVATE_COOKIES',
    'support.microsoft.com',
  ),
  createData('Opera', 'COOKIES_POLICY.EXPLORER_DESACTIVATE_COOKIES', 'help.opera.com'),
  createData('Safari', 'COOKIES_POLICY.SAFARI_DESACTIVATE_COOKIES', 'support.apple.com'),
  createData('Edge', 'COOKIES_POLICY.EDGE_DESACTIVATE_COOKIES', 'support.microsoft.com'),
]
