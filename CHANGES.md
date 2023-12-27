# Change log

## Unreleased

- Continuous integration enabled
- Fix: Animated error image

## 0.3.0 (2023-12-22)

- Invoice Page: uset wants to see invoices addressed to her
- Production Page: Still not yet implemented but pages has a title and icon
- Generic unittested and localized format functions for: euros, dates
- Autoreload api on .env changes
- Order fields in contract details table
- Create navigation component
- Add button to return to installations list
- Add missing translations
- Chevron icon for details instead of threee points
- Fix: Avoid column flicker when filtering (clear selection button changed columns required width)
- api-test are run in autoreload mode like ui-test
- Deployment test:
    - New system dependency: libcairo-dev to generate dummy pdf's

## 0.2.0 (2023-12-18)

- New pages: Installation list, Installation details
- New reusable components:
  - TableEditor: to show list of items with actions
  - SimpleTable: to show data sheets
  - SnackbarMessages: listen messages and show temporary error messages 
  - ErrorSplash: to show static errors
- RGPD check required to access
- UI check API version to match and do a full reload after a countdown
- Error handling:
  - Handling ERP errors in API
  - Sentry integration
  - UI: ovapi unified error handling
- Component Test Page visible in development
- Moved config docs into examples for .env files
- Improved model validation for vat and email fields
- Fix: Profile: Retrieve proxy person information for legal entities
- Profile: Hide empty proxy fields for physical persons
- Profile: Hide roles (if not `VITE_ENABLE_VIEW_ROLE_IN_PROFILE`)
- Upgrade Notes:
    - Added frontend/.env variables:
        - `VITE_ENABLE_VIEW_ROLE_IN_PROFILE`
        - `VITE_ENABLE_BREAKPOINT_INDICATOR`
    - Added .env variables:
        - `SENTRY_DSN` (by default no sentry loggin)
        - `ENV` (by default 'development')

## 0.1.0 (2023-11-03)

- First release
- Application scheleton, profile and local authentication
- Upgrade Notes:
    - Added .env `ERP_PROVISIONING_APIKEY` to provide
      a key for the ERP to provision user.
    - Added .env `DATA_BACKEND`
    - Added .env ERP configuration. See `ERP_*` in README
