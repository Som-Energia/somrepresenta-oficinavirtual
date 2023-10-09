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
- [ ] Auth: Validate ERP user
- [ ] Auth: Doubt: How to provision users?
- [ ] Auth: Doubt: User ids: NIFs, email...?
- [X] Auth: PageGuard: IsAuthenticated
- [ ] Auth: PageGuard: IsRole
- [ ] Abstract ErrorPage

- [ ] Auth: Config to choose between Dummy and Auth
- [ ] Auth: non ssr (rest) solution
- [ ] Auth: Activate PKCE: Proof Key for Code Exchange
- [ ] Auth: Fix: Logout redirects from frontend server to backend server
- [ ] Toaster per errors
- [ ] Auth: `only_http`: make it false for development only, not in production
- [ ] FastAPIOaut2: `only_http`: make it false for development only, not in production




