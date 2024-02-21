# Pending tasks

- [ ] Error Handling: Erp caigut -> VPN no passa testos
- [ ] Els error inexperats duen una referencia que no veu al sentry
- [ ] ErrorSplash: Boto per reportar l'error


- [ ] Auth: Has sense to move PageGuard inside the specific page?
- [ ] Auth: PageGuard: filter by role (attribute allowedRoles (anyOf)? requiredRoles (allOf)?)
- [ ] BUG: Browser language CA-ES not transformed into CA in language button
- [ ] Reimplement remote login without the fastapi-oauth2 library:
    - [ ] The library does a Catch all on all errors exposing the error to the user and hiding trace to devs
    - [ ] Unable to personalize the jwt token
- [ ] Uniform error handling
    - UI:
        - Toast widget as Context, providing methods to open it (error, warning, info...)
        - If error are not API dependant, we should give a way for the user to provide us the info, how?
        - Consider either using MUI SnackBar or something like https://www.npmjs.com/package/material-react-toastify
    - API connection errors:
        - simulate being offline
        - Permanent message: "Application server cannot be reached. Are you offline?"
        - As one of the the api call success, remove message
        - Should be a blocker message, like the version missmatch, not the toaster
    - API call errors:
        - 404...
        - 
    - API unexpected errors:
        - "An unexpected error happened. Reference #1234567890"
        - In api catch unexpected at top level (error handler? decorator?)
        - When catch generate the unique reference, and log it along the full error and stack
    - API expected errors: 
        - Uniform the format and handling, call the toaster
    - ERP unexpected errors
        - Ensure that the ERP callback and the API callback ends in the log
    - ERP expected errors
        - Since ERP expected errors are not raised, raise something if it cannot be handled any other way.
    - ERP connection errors
        - simulate them by missconfiguring ERP
        - Try a global handling for all entry points
        - API returns HTTP Gateway error?
        - UI: Treat it similar to API connection error "Our servers are in maintenance"?
- [ ] logout if api/me unauthorized
- [ ] Abstract ErrorPage from common stuff in different error pages (NotFound, NotYetAvailable, Unauthorized...) to centralize styling

- [ ] models?
    - [ ] D'on treiem els usuaris staff
    - [ ] Correu com identificador implica problemes N:M
    - [ ] giscere.instalacio
    - [ ] giscere.contracte
    - [ ] giscere.factura
    - [ ] tipologia instalacio?
    - [ ] com baixa el pdf
- [ ] Toaster per errors
- [ ] Auth: non ssr (rest) solution
- [ ] Auth: Security: Activate PKCE: Proof Key for Code Exchange
- [ ] Use lazy and Suspense for pages for faster loads
- [ ] Fix: avoid rendering PageGuard childs (lazy?) if not available.

## Done

- [x] Auth: Fix: Logout redirects from frontend server to backend server
- [x] Use NavLink for links in route (adds stylable `active` class when the current path)
- [x] Explore the use of Router Dom outlets to move AppFrame outside the pages
- [x] Auth: `only_http`: make it false for development only, not in production -> fixed, not yet released
    - [x] FastAPIOaut2 Bug: `allow_http` https://github.com/pysnippet/fastapi-oauth2/issues/27
- [x] Quins son els nostres usuaris customer? De `res_partner` quins?
    - filtrem per categoria? -> Si, filtrem per categoria client
    - filtrem per si tenen contractes o factures? -> No, de moment
- [x] A partir de quin moment es dona la provisió d'usuari per feta
    - [x] Quan s'envia el mail de validació de mail -> No quan ET ho activa amb un boto que posarem
- [x] titular_associat?? (nom i nif) d'on ve?
    - [x] Ens estem inventant que es el nif del representant de l'empresa, es aixo? -> si
- [x] Drawer buttons: close drawer on xs profile menu option taken
- [x] Drawer buttons: layout on bottom and equally spaced
- [x] Drawer buttons: Turn them into more verbose list items?
- [x] rename user_info -> identify_login
- [x] use polymorfism for data source
- [] poc
