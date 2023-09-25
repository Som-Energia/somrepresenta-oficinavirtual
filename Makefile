.PHONY: default frontend-run-dev

default:
	@printf "$$HELP"

ui-dev:
	npm run dev --prefix frontend

ui-deps:
	npm install --prefix frontend

ui-test:
	npm run test --prefix frontend

define HELP
    - make dev-ui\t\tStart frontend for development

Please execute "make <command>". Example: make run

endef

export HELP
