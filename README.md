# Oficinavirtual Representa

TODO: Describe the project


## Development setup

```bash
make deps # Install dependencies
make tests # Pass ui and api tests
# In diferent consoles:
make ui-dev # runs the frontend server at localhost:5123
make api-dev # runs the backend server at localhost:5500
```

- In development, the frontend proxies the backend.
- In producction, the backend serves the compiled frontend in `backend/dist`.

TODO: Unify both environment, by achieving hot module reload
while generating in `backend/dist` for the backend to serve in development.


