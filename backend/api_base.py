from pathlib import Path
from fastapi.staticfiles import StaticFiles
from fastapi.exception_handlers import (
    request_validation_exception_handler,
)
from fastapi.exceptions import RequestValidationError
from . import __version__ as version

def setup_base(app):
    @app.get('/api/version')
    def apiVersion():
        return dict(
            version = version,
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request, exc):
        # TODO: sentry this, ui programming error
        return await request_validation_exception_handler(request, exc)

def setup_statics(app):
    # IMPORTANT!
    # This should be called the last of the setups
    # since it is registered at / and will catch all routes
    packagedir = Path(__file__).parent
    distpath = packagedir/'dist'
    app.mount("/", StaticFiles(directory=distpath, html=True), name="ui")


