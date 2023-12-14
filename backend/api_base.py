from pathlib import Path
from uuid import uuid4
from fastapi.responses import JSONResponse
from fastapi import status, Request

from fastapi.staticfiles import StaticFiles
from fastapi.exception_handlers import (
    request_validation_exception_handler,
)
from fastapi.exceptions import RequestValidationError
from consolemsg import error
from . import __version__ as version

def setup_base(app):

    @app.get('/api/version')
    def apiVersion():
        return dict(
            version = version,
        )

    @app.exception_handler(Exception)
    async def unexpected_exception_handler(request: Request, exc: Exception):
        reference = uuid4()

        # TODO: sentry this, ui programming error
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "details": "Internal server error",
                "reference": str(reference),
            },
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


