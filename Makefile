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



define HELP
    - make dev-ui\t\tStart frontend for development

Please execute "make <command>". Example: make run

endef

export HELP
