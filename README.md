# Oficinavirtual Representa

Virtual office of somenergia's representation service

## Development setup

### Requirements

- python>=3.8
- make
- node>=20.4.0

Early versions could work but not tested.

If you system default Python do not meet python requirements,
the recommended path is to use pyenv to install the required version
and activate it local in the project directory before installing dependencies.

```bash
pyenv install 3.11
pyenv local 3.11
```

### Dependencies

```bash
make deps # Installs dependencies (for python creates the virtual environment if missing)
```

### Tests

```bash
make tests # Pass ui and api tests
```

### Configuration

Backend Config:

```bash
# .env

# You get the next two when you create you client app on google console
# https://console.cloud.google.com/apis/credentials
# Be aware that you need to specify properly any redirect targeta
OAUTH2_GOOGLE_CLIENT_ID='alongkeyfromgoogle.apps.googleusercontent.com'
OAUTH2_GOOGLE_CLIENT_SECRET='anotherlongkeyfromgoogle'

# Used to encrypt sessions (not used yet)
SESSION_SECRET='randomgeneratethisone'

# Used to encrypt session jwt tokens
JWT_SECRET='alsorandomgeneratethisotherone'

# Time to live for the JWT session in seconds
JWT_EXPIRES=86400 # one day in seconds 60*60*12

# Key to be used in the x-key header to provision users
# For security you can remove it when not provisioning users
ERP_PROVISIONING_APIKEY="averylongrandomlygeneratedkey"
```

Frontend Config:

```bash
# frontend/.env.local

# Overrides for you development setup the defaults in frontend/.env
VITE_AUTH_BACKEND=Oauth2 # Delegate auth to an external AuthServer (Google, Keycloak...)
#VITE_AUTH_BACKEND=Oauth2Local # First party login
#VITE_AUTH_BACKEND=Dummy # Emulate login with a closed list of users in frontend/src/data/dummyusers.yaml (api calls won't work)
```

### Application startup

```bash
# In diferent consoles:
make ui-dev # runs the frontend server at localhost:5123
make api-dev # runs the backend server at localhost:5500
```

- In development, the frontend proxies the backend.
- In producction, the backend serves the compiled frontend in `backend/dist`.

TODO: Unify both environments, by achieving hot module reload
while generating in `backend/dist` for the backend to serve in development.
