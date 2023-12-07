from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from dotenv import load_dotenv
from . import __version__ as version
from .authlocal import setup_authlocal
from .api_business import setup_business

def setup_base(app):
    @app.get('/api/version')
    def apiVersion():
        return dict(
            version = version,
        )


def setup_statics(app):
    # IMPORTANT!
    # This should be called the last of the setups
    # since it is registered at / and will catch all routes
    packagedir = Path(__file__).parent
    distpath = packagedir/'dist'
    app.mount("/", StaticFiles(directory=distpath, html=True), name="ui")

async def app(scope, receive, send):
    load_dotenv()
    app = FastAPI()
    setup_base(app)
    #setup_auth(app)
    setup_authlocal(app)
    setup_business(app)
    setup_statics(app)
    [print(r) for r in app.routes]
    return await app(scope, receive, send)


