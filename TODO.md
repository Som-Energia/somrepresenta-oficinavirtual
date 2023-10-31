# Pending tasks

- [ ] rename user_info -> identify_login
- [ ] use polymorfism for data source
- [ ] Unexpected Error handling: current (unexpected) error handling in fastapi
      hides errors information (trace) and forwards error message to the user.
      We want to have the full stack in logs/sentry and, because security,
      giving no information to the user about the concrete unexpected error.
- [ ] if api/me unauthorized, logout
- [ ] Auth: PageGuard: filter by role (attribute allowedRoles (anyOf)? requiredRoles (allOf)?)
- [ ] Abstract ErrorPage from common stuff in different error pages (NotFound, NotYetAvailable, Unauthorized...) to centralize styling

- [ ] models?
    - [ ] Quins son els nostres usuaris? De `res_partner` quins?
        - filtrem per categoria?
        - filtrem per si tenen contractes o factures?
    - [ ] A partir de quin moment es dona la provisió d'usuari per feta
        - [ ] Quan s'envia el mail de validació de mail
    - [ ] titular_associat?? (nom i nif) d'on ve?
        - Ens estem inventant que es el nif del representant de l'empresa, es aixo?
    - [ ] Correu com identificador implica problemes N:M
    - [ ] giscere.instalacio
    - [ ] giscere.contracte
    - [ ] giscere.factura
    - [ ] tipologia instalacio?
    - [ ] com baixa el pdf
- [ ] Com muntar el modul

    - [ ] separat
    - [ ] criteri versionat **terp**
    - [ ] Nom del repo: `openerp_som_representa`?
    - [ ] Nom del modul: `som_representa_www`?
    - [ ] Convenció de versionat de mòduls
    - [ ] diferencia entre: init - update - demo

- [ ] Auth: non ssr (rest) solution
- [ ] Auth: Security: Activate PKCE: Proof Key for Code Exchange
- [ ] Auth: Fix: Logout redirects from frontend server to backend server
- [ ] Toaster per errors
- [ ] Auth: `only_http`: make it false for development only, not in production
- [ ] FastAPIOaut2 Bug: `allow_http` https://github.com/pysnippet/fastapi-oauth2/issues/27
- [ ] Browser language CA-ES not transformed into CA in language button
- [ ] Use NavLink for links in route (adds stylable `active` class when the current path)
- [ ] Use lazy and Suspense for pages for faster loads
- [ ] Explore the use of Router Dom outlets to move AppFrame outside the pages
- [ ] Fix: avoid rendering PageGuard childs (lazy?) if not available.
