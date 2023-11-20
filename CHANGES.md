# Change log

## Unreleased

- UI check API version to match and do a full reload after a countdown
- RGPD check required to access
- Improved model validation for vat and email fields
- Fix: Profile: Retrieve proxy person information for legal entities
- Profile: Hide empty proxy fields for physical persons
- Profile: Hide roles (if not `VITE_ENABLE_VIEW_ROLE_IN_PROFILE`)
- Upgrade Notes:
    - Added frontend/.env  `VITE_ENABLE_VIEW_ROLE_IN_PROFILE`

## 0.1.0 (2023-11-03)

- First release
- Application scheleton, profile and local authentication
- Upgrade Notes:
    - Added .env `ERP_PROVISIONING_APIKEY` to provide
      a key for the ERP to provision user.
    - Added .env `DATA_BACKEND`
    - Added .env ERP configuration. See `ERP_*` in README
