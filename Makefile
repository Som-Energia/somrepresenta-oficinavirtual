.PHONY: default frontend-run-dev

default:
	@printf "$$HELP"

deps: ui-deps api-deps

tests: api-test ui-test-once

ui-build:
	npm run build

ui-dev:
	npm run dev

ui-deps:
	npm install

ui-test:
	npm run test

ui-test-once:
	npm run test:once

api-dev:
	.venv/bin/python scripts/representa_api.py --debug

api-deps:
	test -e .venv || python -m venv .venv
	.venv/bin/pip install -e .

api-test:
	.venv/bin/pytest

style:
	node_modules/.bin/prettier --write . --config frontend/.prettierrc.yaml



define HELP
    - make deps\t\tInstall front and backend environment
    - make ui-deps\t\tInstall frontend environment
    - make api-deps\t\tInstall backend environment
    - make ui-dev\t\tStart frontend development server
    - make api-dev\t\tStart backend development server
    - make ui-test\t\tPass frontend tests
    - make api-test\t\tPass backend tests
    - make test\t\tPass backend and frontend tests
    - make build\t\tBuild frontend distribution files

Please execute "make <command>". Example: make run

endef

export HELP
