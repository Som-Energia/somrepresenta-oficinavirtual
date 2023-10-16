# Pending tasks

- Temes i logo igual que som? o es especific de Representa
- Login
    - Tipus d'usuari
        - Admin
            - Crea usuaris
        - Staff
            - Accedeix al backofficce
        - Customer
            - Accedeix al frontoffice
    - On es fa la validacio de les condicions? Auth server? OV?

Auth
    currentUser() -> null | User?
    login() -> redirect to login page
    logout() -> invalidate login

- [x] Auth: Linking auth redirect back to the web
- [x] Auth: Uniformize profile attributes
- [x] Auth: PageGuard: IsAuthenticated
- [x] AppFrame of of concrete page components
- [x] Auth: Doubt: How to provision users? -> Manually using erp backoffice
- [x] Auth: Doubt: Staff and Admin is needed? -> Not by now
- [x] Auth: Doubt: User ids: NIFs, email...? -> Nifs
- [x] Auth: Config to choose between Dummy and Auth

- [ ] Auth: Validate user with ERP
- [ ] Auth: Using nif instead of email to login
- [ ] Auth: Doubt: How to relate emails and NIF (it is a N:M relation)
- [ ] Auth: PageGuard: filter by role (attribute allowedRoles (anyOf)? requiredRoles (allOf)?)
- [ ] Abstract ErrorPage from common stuff in different error pages (NotFound, NotYetAvailable, Unauthorized...) to centralize styling

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


