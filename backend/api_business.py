from fastapi import Request, Depends, status
from fastapi.responses import JSONResponse, StreamingResponse
from .models import UserProfile, SignatureResult, InstallationSummary, InstallationDetailsResult, Invoice
from .datasources import profile_info, sign_document, installation_list, installation_details, invoice_list, invoice_pdf
from .erp import ErpConnectionError
from .auth import validated_user
from consolemsg import error

def setup_business(app):

    @app.exception_handler(ErpConnectionError)
    async def erp_connection_error_handler(request: Request, exc: ErpConnectionError):
        # TODO: Log exception
        error("Unable to reach ERP")
        return JSONResponse(
            status_code=status.HTTP_502_BAD_GATEWAY,
            content={"details": "Unable to reach ERP"},
        )

    @app.get('/api/me')
    def api_profile_information(user: dict = Depends(validated_user)) -> UserProfile:
        return profile_info(user)

    @app.post('/api/sign_document/{document}')
    def api_sign_document(document: str, user: dict = Depends(validated_user)) -> SignatureResult:
        return sign_document(user['username'], document)

    @app.get('/api/installations')
    def api_installation_list(user: dict = Depends(validated_user)) -> list[InstallationSummary]:
        return installation_list(user['username'])

    @app.get('/api/installation_details/{contract_number}')
    def api_installation_details(contract_number: str, user: dict = Depends(validated_user)) -> InstallationDetailsResult:
        return installation_details(user['username'], contract_number)

    @app.get('/api/invoices')
    def api_invoice_list(user: dict = Depends(validated_user)) -> list[Invoice]:
        return invoice_list(user['username'])

    @app.get('/api/invoice/{invoice_number}/pdf')
    def api_invoice_pdf(invoice_number: str, user: dict = Depends(validated_user)):
        #result = download_invoice_pdf(user['username'], invoice_number)
        from yamlns import ns
        import base64
        import io
        result = ns(invoice_pdf(user['username'], invoice_number))

        def filestream(data_base64):
            with io.BytesIO(base64.b64decode(data_base64)) as f:
                yield from f

        return StreamingResponse(
            filestream(result.content),
            media_type=result.content_type,
            headers = {
                'Content-Disposition': f'attachment; filename="{result.filename}"',
            },
        )
