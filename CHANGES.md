# Change log

## unreleased
- Fix rated_power from int to float

## 1.3.0 (2025-02-26)
- Change referencies to new erp module
- Fix type installations can be None

## 1.2.4 (2025-02-12)
- Fix DatePicker translations

## 1.2.3 (2025-01-23)
- Add Displaced paramter to curves chart

## 1.2.2 (2025-01-16)
- Fix displaced 1 hour in curves chart

## 1.2.1 (2025-01-13)
- Avoid errors when a new maturity is added
- Upgrade somenergia-ui to 0.5.1 that fixes curve labels

## 1.2.0 (2024-11-13)
- Add HD maturity

## 1.1.1 (2024-08-12)
- Fix script cookies (new url and key)

## 1.1.0 (2024-08-07)
- Add application auth remote authentication to work with Authentik
  - Authentik user login and provisioning
  - Upgrade notes:
      - New backend environment vars (see .env-example):
          - env AUTHENTIK_API_URL
          - env AUTHENTIK_TOKEN
          - env AUTHENTIK_GROUP_ID
          - env OAUTH2_AUTHENTIK_REDIRECT_URI
          - env OAUTH2_AUTHENTIK_CLIENT_ID
          - env OAUTH2_AUTHENTIK_CLIENT_SECRET
      - Set `frontend/.env` variable:
          - env `VITE_AUTH_BACKEND` to `Oauth2`
            to enable remote authentication with Authentik

## 1.0.0 (2024-07-26)

- Invoices
    - Custom timeout for some ERP queries
    - Report invoice zip timeout
    - Single zip for many invoices
    - Special value for complementary liquidations
- Fix: Accept Profiles without city
- Chat notification of failures

## 0.7.0 (2024-05-15)

- Responsive invoice page
- New widget: ListEditor (mobile)
- New widget: MultiDataEditor (responsive, choses between a TableEditor or a ListEditor)
- Production page: Added a button to download data as csv
- Invoice page: Downloading selected invoices as a zip of pdf's
- Fix: Production data: Convert to string dates sent to erp
- Fix: Production data: Retrieves measures for a single installation
- Ugprade Notes:
    - env `ERP_DEBUG` to activate ERP call logging

## 0.6.0 (2024-02-14)

- Add production data page with foreseen and production measures
- PaymentCell component to show Invoice Payment Status information
- Add cookies' banner and policy page


## 0.5.0 (2024-01-23)

- Hijack implementation

## 0.4.2 (2024-01-03)

- Fix: details failed because misspelled attribute name
- Fix: error handling in install details and list pages
- Fix: misspelled ca translation
- Fix: installation list with nodata failed
- Android downloads (see somrepresenta-android repo)

## 0.4.1 (2023-12-30)

- Fixed numerous problems with translations and libraries
  due to 3rd party duplication via the component library.
- Chunked vendor output modules
- Fixed some code messed up during the last merge
- Linter clean up (bad css, unreachable returns...)
- Removed all mui full imports

## 0.4.0 (2023-12-29)

- Smart invoice pdf buttons (show progress, errors, completion)
- Contract navigation
- Animated error image
- Localized formatting for installation details fields
- Added missing translations for enum values from ERP
- Development infrastructure
    - Continuous integration enabled
    - Using component library

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
