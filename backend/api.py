from fastapi import FastAPI, Request, Depends
from fastapi.responses import FileResponse
from pathlib import Path
from dotenv import load_dotenv
from . import __version__ as version
from .auth import setup_auth, validated_user

load_dotenv()
app = FastAPI()

packagedir = Path(__file__).parent
distpath = packagedir/'dist'

@app.get('/')
@app.get('/{file}')
def frontend(request: Request, file=None):
    return FileResponse(distpath / (file or 'index.html'))

@app.get('/assets/{file}')
def static_files(request: Request, file=None, dir=None):
    return FileResponse(distpath / 'assets' / (file or 'index.html'))

@app.get('/api/version')
def apiVersion():
    return dict(
        version = version,
    )

@app.get('/api/me')
def apiMe(user: dict = Depends(validated_user)):
    return dict(
        user,
        avatar = user['picture'],
        roles=['customer'],
        nif = '12345678X',
        address = 'Rue del Percebe, 13',
        city = 'Salt',
        zip = '17234',
        state = 'Girona',
        phone = '555444333',
        proxy_name = 'Matute Gonzalez, Frasco',
        proxy_nif = '987654321X',
    )

setup_auth(app)

