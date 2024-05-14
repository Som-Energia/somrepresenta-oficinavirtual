from contextlib import contextmanager
from yamlns import ns
from consolemsg import error, success
from typing import Optional
from pydantic import ValidationError, AwareDatetime
from ..models import (
    TokenUser,
    UserProfile,
    SignatureResult,
    InstallationSummary,
    InstallationDetailsResult,
    Invoice,
    InvoicePdf,
    InvoicesZip,
    CustomerProductionData,
)
from .. import erp
from ..utils.gravatar import gravatar
from ..utils.vat import nif2vat
from .exceptions import (
    ErpError,
    ErpValidationError,
    ContractWithoutInstallation,
    ContractNotExists,
    UnauthorizedAccess,
    NoSuchUser,
    NoSuchInvoice,
    NoDocumentVersions,
)
from .dummy import dummy_invoice_pdf


@contextmanager
def catch_validation_error():
    try:
        yield
    except ValidationError as exception:
        raise ErpValidationError(exception)


expected_erp_exceptions = [
    ContractWithoutInstallation,
    ContractNotExists,
    UnauthorizedAccess,
    NoSuchUser,
    NoSuchInvoice,
    NoDocumentVersions,
]


def process_erp_errors(erp_response):
    if "error" not in erp_response:
        return
    erp_errors = {excp.__name__: excp for excp in expected_erp_exceptions}
    SpecificError = erp_errors.get(erp_response["code"], ErpError)
    raise SpecificError(erp_response)


def erp_user_info(login: str):
    e = erp.Erp()
    # TODO: Handle emails as login
    result = ns(e.identify(nif2vat(login)))
    # TODO: process_erp_errors(retrieved)
    if "error" in result:
        error(result.dump())
        return None

    result.avatar = gravatar(result.email)

    with catch_validation_error():
        return TokenUser(**result)


def erp_profile_info(user_info: dict) -> UserProfile:
    e = erp.Erp()
    retrieved = e.profile(user_info["username"])
    # TODO: process_erp_errors(retrieved)
    with catch_validation_error():
        return UserProfile(**retrieved)


def erp_sign_document(username: str, document: str) -> SignatureResult:
    e = erp.Erp()
    retrieved = e.sign_document(username, document)
    process_erp_errors(retrieved)
    with catch_validation_error():
        return SignatureResult(**retrieved)


def erp_installation_list(username: str) -> list[InstallationSummary]:
    e = erp.Erp()
    installations = e.list_installations(username)
    process_erp_errors(installations)
    with catch_validation_error():
        return [InstallationSummary(**installation) for installation in installations]


def erp_installation_details(
    username: str, contract_number: str
) -> InstallationDetailsResult:
    e = erp.Erp()
    retrieved = e.installation_details(username, contract_number)
    process_erp_errors(retrieved)
    with catch_validation_error():
        return InstallationDetailsResult(**retrieved)


def erp_invoice_list(username: str) -> list[Invoice]:
    e = erp.Erp()
    invoices = e.list_invoices(username)
    process_erp_errors(invoices)
    with catch_validation_error():
        return [Invoice(**invoice) for invoice in invoices]


def erp_invoice_pdf(username: str, invoice_number: str) -> InvoicePdf:
    e = erp.Erp()
    pdffile = e.invoice_pdf(username, invoice_number)
    process_erp_errors(pdffile)
    with catch_validation_error():
        return InvoicePdf(**pdffile)

def erp_invoices_zip(username: str, invoice_numbers: list[str]) -> InvoicesZip:
    e = erp.Erp()
    zipfile = e.invoices_zip(username, invoice_numbers)
    process_erp_errors(zipfile)
    with catch_validation_error():
        return InvoicesZip(**zipfile)

def erp_production_data(
        username: str,
        first_timestamp_utc: AwareDatetime,
        last_timestamp_utc: AwareDatetime,
        contract_number: Optional[str] = None
    ) -> CustomerProductionData:
    e = erp.Erp()
    production_data = e.production_data(
        username,
        first_timestamp_utc,
        last_timestamp_utc,
        contract_number
    )
    process_erp_errors(production_data)
    with catch_validation_error():
        return CustomerProductionData(**production_data)


class ErpBackend:
    def user_info(self, login: str) -> TokenUser | None:
        return erp_user_info(login)

    def profile_info(self, user_info: dict) -> UserProfile:
        return erp_profile_info(user_info)

    def sign_document(self, username: str, document: str) -> SignatureResult:
        return erp_sign_document(username, document)

    def installation_list(self, username: str) -> list[InstallationSummary]:
        return erp_installation_list(username)

    def installation_details(
        self, username: str, contract_number: str
    ) -> InstallationDetailsResult:
        return erp_installation_details(username, contract_number)

    def invoice_list(self, username: str) -> list[Invoice]:
        return erp_invoice_list(username)

    def invoice_pdf(self, username: str, invoice_number: str) -> InvoicePdf:
        return erp_invoice_pdf(username, invoice_number)

    def invoices_zip(self, username: str, invoice_numbers: list[str]) -> InvoicesZip:
        return erp_invoices_zip(username, invoice_numbers)

    def production_data(
        self,
        username: str,
        first_timestamp_utc: AwareDatetime,
        last_timestamp_utc: AwareDatetime,
        contract_number: Optional[str] = None,
    ) -> CustomerProductionData:
        return erp_production_data(
            username,
            first_timestamp_utc,
            last_timestamp_utc,
            contract_number
        )
