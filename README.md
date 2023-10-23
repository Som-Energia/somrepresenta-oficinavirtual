# Oficinavirtual Representa

Virtual office of somenergia's representation service

## Development setup

### Requirements

- python>=3.8
- make
- node>=20.4.0

Early versions could work but not tested.

### Dependencies

```bash
make deps # Install dependencies
```

### Tests

```bash
make tests # Pass ui and api tests
```

### Configuration

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
