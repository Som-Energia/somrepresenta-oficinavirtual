#!/usr/bin/env python

import click
from consolemsg import warn, step
from backend import __version__
import os

@click.command()
@click.help_option()
@click.version_option(__version__)

@click.option('--debug',
    is_flag=True,
    help="Runs in debug mode",
    )
@click.option('--host', '-h',
    default='0.0.0.0',
    help="The address to listen to",
    )
@click.option('--port', '-p',
    type=int,
    default=5500,
    help="The port to listen to",
    )
@click.option('--printrules',
    is_flag=True,
    help="Prints the url patterns being serverd",
    )
def main(debug, host, port, printrules):
    "Runs the web and API"
    print(debug, host, port, printrules)

    step("Starting API")
    if printrules:
        os.environ["SHOW_ROUTES"]="1"
    extra_watched=[
        '.*', # to include .env s
    ]
    extra_excluded=[
        '*.swp', # to exclude swaps excluded in the old .* exclusion
    ]
    import uvicorn
    uvicorn.run("backend.api:app", host=host, port=port, reload=debug, reload_includes=extra_watched, reload_excludes=extra_excluded)
    step("API stopped")

if __name__=='__main__':
    main()

