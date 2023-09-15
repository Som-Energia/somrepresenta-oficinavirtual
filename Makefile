.PHONY: default frontend-run-dev

default:
	@printf "$$HELP"

frontend-run-dev:
	npm run dev --prefix frontend


define HELP
    - make frontend-run-dev\t\tStart frontend for development

Please execute "make <command>". Example: make run

endef

export HELP
