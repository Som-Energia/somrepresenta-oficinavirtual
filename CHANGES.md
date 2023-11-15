# Change log

## Unreleased

- Fix: Showing proxy person information for legal entities
- Improved model validation for vat and email fields
- Profile: Hide proxy fields for physical persons
- Profile: Hide roles (if VITE_ENABLE_VIEW_ROLE_ON_PROFILE)
- Upgrade Notes:
    - Added frontend/.env  VITE_ENABLE_VIEW_ROLE_ON_PROFILE


## 0.1.0 (2023-11-03)

- First release
- Application scheleton, profile and local authentication
- Upgrade Notes:
    - Added .env `ERP_PROVISIONING_APIKEY` to provide
      a key for the ERP to provision user.
    - Added .env `DATA_BACKEND`
    - Added .env ERP configuration. See `ERP_*` in README
