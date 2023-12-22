# Oficinavirtual Representa

Virtual office of somenergia's representation service

## Development setup

### Requirements

- python>=3.10
- make
- node>=20.4.0
- libcairo-dev

Early versions could work but not tested.

If you system default Python do not meet python requirements,
the recommended path is to use pyenv to install the required version
and activate it local in the project directory before installing dependencies.

```bash
pyenv install 3.10
pyenv local 3.10
```

### Dependencies

```bash
make deps # Installs dependencies (for python creates the virtual environment if missing)
```

### Tests

```bash
make tests # Pass ui and api tests
```

While in a test driven session you can run test in auto reload mode.
But you have to run ui and api tests separatelly.

```bash
make ui-test
make api-test
```

### Configuration

Backend Config. Copy `.env-example` as `.env` and edit.

Frontend Config: Defaults in `frontend/.env` can be overriden
by copying `frontend/.env.local-example` as `frontend/.env.local` and editing it.

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

### `representa-manage`

`representa-manage` is a installed script which includes, as subcommands, some utilities for operation and development.

Some of them are:

- reset-password: resets the password of a user
- list-signatures: removes the signatures made by a user
- clear-signatures: removes the signatures made by a user

See the command help for more information.

### Deploy upgrades

- `git fetch` to get the latest updates
- `tig --all` to see deployed and incoming version
- `git rebase`
- Review CHANGES.md for Upgrade Notes (since last deployed version)
- `make deploy`  Install ui/api dependencies and build ui
- `sudo supervisor restart`
