from fastapi import Request, Depends, status
from fastapi.responses import JSONResponse
from .models import (
    UserProfile,
    SignatureResult,
    InstallationSummary,
    InstallationDetailsResult,
    Invoice,
    InvoicePdf,
)
from .datasources import (
    profile_info,
    sign_document,
    installation_list,
    installation_details,
    invoice_list,
    invoice_pdf,
)
from .erp import ErpConnectionError
from .auth import validated_user
from .utils.responses import PdfStreamingResponse
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

    @app.get(
        '/api/invoice/{invoice_number}/pdf',
        response_class=PdfStreamingResponse,
    )
    def api_invoice_pdf(invoice_number: str, user: dict = Depends(validated_user)):
        from yamlns import ns
        result: InvoicePdf = invoice_pdf(user['username'], invoice_number)

        return PdfStreamingResponse(
            binary_data=result.content,
            filename=result.filename,
        )
