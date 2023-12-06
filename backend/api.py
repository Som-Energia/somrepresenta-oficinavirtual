from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from dotenv import load_dotenv
from . import __version__ as version
from .authlocal import setup_authlocal
from .api_business import setup_business

load_dotenv()
app = FastAPI()

packagedir = Path(__file__).parent
distpath = packagedir/'dist'

@app.get('/api/version')
def apiVersion():
    return dict(
        version = version,
    )

#setup_auth(app)
setup_authlocal(app)
setup_business(app)
app.mount("/", StaticFiles(directory=distpath, html=True), name="ui")

