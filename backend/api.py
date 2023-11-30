from fastapi import FastAPI, Request, Depends
from fastapi.responses import FileResponse
from pathlib import Path
from dotenv import load_dotenv
from . import __version__ as version
from .auth import setup_auth, validated_user
from .authlocal import setup_authlocal
from .models import UserProfile, TokenUser, SignatureResult, InstallationSummary
from .datasources import profile_info, sign_document, installation_list

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
def apiMe(user: dict = Depends(validated_user)) -> UserProfile:
    return profile_info(user)

@app.post('/api/sign_document/{document}')
def apiSignDocument(document: str, user: dict = Depends(validated_user)) -> SignatureResult:
    return sign_document(user['username'], document)

@app.get('/api/installations')
def apiInstallations(user: dict = Depends(validated_user)) -> list[InstallationSummary]:
    return installation_list(user['username'])

#setup_auth(app)
setup_authlocal(app)

