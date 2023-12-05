from fastapi import Request, Depends, status
from fastapi.responses import JSONResponse
from .models import UserProfile, SignatureResult, InstallationSummary
from .datasources import profile_info, sign_document, installation_list
from .erp import ErpConnectionError
from .auth import validated_user
from consolemsg import error

def setup_business(app):

    @app.exception_handler(ErpConnectionError)
    async def erp_connection_error_hand(request: Request, exc: ErpConnectionError):
        # TODO: Log exception
        error("Unable to reach ERP")
        return JSONResponse(
            status_code=status.HTTP_502_BAD_GATEWAY,
            content={"details": "Unable to reach ERP"},
        )

    @app.get('/api/me')
    def api_me(user: dict = Depends(validated_user)) -> UserProfile:
        return profile_info(user)

    @app.post('/api/sign_document/{document}')
    def api_sign_document(document: str, user: dict = Depends(validated_user)) -> SignatureResult:
        return sign_document(user['username'], document)

    @app.get('/api/installations')
    def api_installations(user: dict = Depends(validated_user)) -> list[InstallationSummary]:
        return installation_list(user['username'])
