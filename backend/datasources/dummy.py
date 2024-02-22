from yamlns import ns
from pathlib import Path
import datetime
import base64
from pydantic import ValidationError, AwareDatetime
from ..utils.gravatar import gravatar
from ..models import (
    TokenUser,
    UserProfile,
    SignatureResult,
    InstallationSummary,
    InstallationDetailsResult,
    Invoice,
    InvoicePdf,
    InvoicesZip,
    ProductionData,
    CustomerProductionData,
    ContractProductionData,
)
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

# Fake signed documents repository
# Empties whenever the app is reloaded
_signed_documents = ns()


def dni_from_seed(seed):
    """Returns a valid but random nif depending on seed string"""
    import hashlib

    digest = hashlib.sha1(seed.encode("utf8")).digest()
    dnistr = "".join(str(c)[-1] for c in digest)[-8:]
    dniint = int(dnistr)
    checkdigit = "TRWAGMYFPDXBNJZSQVHLCKE"[dniint % 23]
    return "ES" + dnistr + checkdigit


def dummy_user_info(login: str) -> TokenUser:
    """
    This token emulates a erp query on user info for a given username/login.

    When username is a NIF, uses its VAT version to fill then email and fills a fake name.

    >>> def p(x): print(ns(x.model_dump()).dump())
    >>> p(dummy_user_info(login='12345678Z'))
    username: ES12345678Z
    vat: ES12345678Z
    name: Perico Palotes
    email: 12345678z@nowhere.com
    roles:
    - customer
    avatar: https://www.gravatar.com/avatar/3c21fd9dfd53a55fc2dccd9927223026?d=404&s=128
    <BLANKLINE>

    When username is an email, extracts the first part as name, and fills a
    fake vat that depends on the email hash

    >>> def p(x): print(ns(x.model_dump()).dump())
    >>> p(dummy_user_info(login='12345678Z'))
    username: ES12345678Z
    vat: ES12345678Z
    name: Perico Palotes
    email: 12345678z@nowhere.com
    roles:
    - customer
    avatar: https://www.gravatar.com/avatar/3c21fd9dfd53a55fc2dccd9927223026?d=404&s=128
    <BLANKLINE>

    When username is an email, extracts the first part as name, and fills a
    fake vat that depends on the email hash

    >>> p(dummy_user_info(login='ahmed.jimenez@noplace.com'))
    username: ahmed.jimenez@noplace.com
    vat: ES23435017H
    name: Ahmed Jimenez
    email: ahmed.jimenez@noplace.com
    roles:
    - customer
    avatar: https://www.gravatar.com/avatar/b33b174df857c3739090351199b1df78?d=404&s=128
    <BLANKLINE>

    When username is neither a NIF nor an email, considers it a erp username.
    builds an email out of it, a vat from the hash, and assigns 'staff' role.

    >>> p(dummy_user_info(login='Sira Ruiz'))
    username: ES75881875E
    vat: ES75881875E
    name: Sira Ruiz
    email: sira.ruiz@somenergia.coop
    roles:
    - staff
    avatar: https://www.gravatar.com/avatar/83d1453396767bac8bf5fb110e68c142?d=404&s=128
    <BLANKLINE>

    """

    vat = None
    username = None
    roles = ["customer"]
    if "@" in login:
        email = login
        name = " ".join(
            token.title()
            for token in login.split("@")[0]
            .replace(".", " ")
            .replace("_", " ")
            .replace("-", " ")
            .split()
        )
        username = email
    else:
        email = ".".join(login.replace(".,", " ").split()).lower()
        if login[3:6].isdigit():
            vatprefix = ""
            if not login.startswith("ES"):
                vatprefix = "ES"
            name = "Perico Palotes"
            vat = vatprefix + login
            email += "@nowhere.com"
            username = vat
        else:
            name = login
            email += "@somenergia.coop"

    if email.endswith("@somenergia.coop"):
        roles = ["staff"]
    vat = vat or dni_from_seed(login)
    username = username or vat
    avatar = gravatar(email)
    return TokenUser(
        username=username,
        vat=vat,
        name=name,
        email=email,
        roles=roles,
        picture=avatar,
        avatar=avatar,
    )


def dummy_profile_info(user_info: dict) -> UserProfile:
    # TODO: Either query ERP or have a rich jwt and take data from it
    default = dict(
        avatar=user_info.get("avatar", user_info.get("picture", None)),
        username="ES12345678X",
        vat="ES12345678X",
        address="Rue del Percebe, 13",
        city="Salt",
        zip="17234",
        state="Girona",
        phones=["555444333"],
        proxy_name="Matute Gonzalez, Frasco",
        proxy_vat="ES87654321X",
        roles=["customer"],
        signed_documents=[],
    )
    profile = UserProfile(**dict(default, **user_info))
    profile.signed_documents = [
        dict(
            document=document,
            version=version,
        )
        for document, version in _signed_documents.setdefault(
            profile.username, dict()
        ).items()
    ]
    return profile


def dummy_sign_document(username: str, document: str) -> SignatureResult:
    versions = ns.loads(
        """
        RGPD_OV_REPRESENTA: '2023-11-09 00:00:00'
    """
    )
    current_version = versions.get(document)
    if not current_version:
        raise Exception("No such document")
    _signed_documents.setdefault(username, ns())[document] = current_version
    return SignatureResult(
        signed_version=current_version,
    )


def dummy_installation_list(username: str) -> list[InstallationSummary]:
    def generative_installation(i):
        cities = ["Manlleu", "Manacor", "Tivisa"]
        installs = ["Pavelló", "Piscina", "Casal"]
        install = installs[i % len(installs)]
        city = cities[(i // len(installs)) % len(cities)]
        return InstallationSummary(
            contract_number=f"19000{username[-2]}_{i}",
            installation_name=f"{city} {install}",
        )

    return [
        InstallationSummary(
            contract_number=name,
            installation_name=f"Raises a {name} error",
        )
        for name in installation_details_exceptions.keys()
    ] + [generative_installation(i) for i in range(int(username[-3]))]


installation_details_exceptions = {
    e.__name__: e
    for e in [
        UnauthorizedAccess,
        ContractWithoutInstallation,
        ContractNotExists,
        ErpValidationError,
        # TODO: ErpConnectionError,
        # TODO: ErpUnexpectedError,
    ]
}


def dummy_installation_details(
    username: str, contract_number: str
) -> InstallationDetailsResult:
    if contract_number == "ErpValidationError":
        try:
            InstallationDetailsResult()  # Missing all attributes
        except ValidationError as error:
            raise ErpValidationError(error)
    if contract_number in installation_details_exceptions:
        raise installation_details_exceptions[contract_number](
            dict(
                code=contract_number,
                error=f"{contract_number} (Dummy error)",
            )
        )
    details = InstallationDetailsResult(
        **ns.load("frontend/src/data/dummyinstallationdetail.yaml")
    )
    details.installation_details.contract_number = contract_number
    return details


invoice_pdf_exceptions = {
    e.__name__: e
    for e in [
        UnauthorizedAccess,
        NoSuchUser,
        NoSuchInvoice,
        ErpValidationError,
        # TODO: ErpConnectionError,
        # TODO: ErpUnexpectedError,
    ]
}

invoices_zip_exceptions = {
    e.__name__: e
    for e in [
        UnauthorizedAccess,
        NoSuchUser,
        ErpValidationError,
        # TODO: ErpConnectionError,
        # TODO: ErpUnexpectedError,
    ]
}

def dummy_invoices(username: str) -> list[Invoice]:
    return [
        Invoice(**invoice)
        for invoice in ns.load("frontend/src/data/dummyinvoices.yaml")
    ] + [
        Invoice(
            invoice_number=name,
            contract_number="10002",
            emission_date="2020-01-01",
            first_period_date="2020-01-01",
            last_period_date="2020-01-01",
            amount=200,
            payment_status='open',
        ) for name in invoice_pdf_exceptions.keys()
    ]


def pdf_content(invoice_number):
    from xhtml2pdf import pisa
    import io

    html = f"""
        <style>h1 {{font-size: 4rem}}</style>
        <h1>Factura {invoice_number}</h1>
    """
    with io.BytesIO() as output:
        pisa.CreatePDF(
            src=html,
            dest=output,
        )
        return output.getvalue()


def dummy_invoice_pdf(username: str, invoice_number: []):
    if invoice_number in invoice_pdf_exceptions:
        raise invoice_pdf_exceptions[invoice_number](
            dict(
                code=invoice_number,
                error=f"{invoice_number} (Dummy error)",
            )
        )
    base64_data = base64.b64encode(Path("/usr/share/doc/tig/manual.pdf").read_bytes())
    base64_data = base64.b64encode(pdf_content(invoice_number))
    return InvoicePdf(
        content=base64_data,
        filename=f"factura-{invoice_number}.pdf",
        content_type="application/pdf",
    )


def zip_content(invoice_numbers):
    import zipfile
    from xhtml2pdf import pisa
    import io

    zipfile_io = io.BytesIO()
    zipfile_ = zipfile.ZipFile(zipfile_io, "w")

    for invoice_number in invoice_numbers:
        html = f"""
            <style>h1 {{font-size: 4rem}}</style>
            <h1>Factura {invoice_number}</h1>
        """
        with io.BytesIO() as output:
            pisa.CreatePDF(
                src=html,
                dest=output,
            )
            zipfile_.writestr(invoice_number, output.getvalue())

    zipfile_.close()
            
    return base64.b64encode(zipfile_io.getvalue())


def dummy_invoices_zip(username: str, invoice_numbers: []):
    for invoice_number in invoice_numbers:
        if invoice_number in invoices_zip_exceptions:
            raise invoices_zip_exceptions[invoice_number](
                dict(
                    code=invoice_number,
                    error=f"{invoice_number} (Dummy error)",
                )
            )

    return InvoicesZip(
        content=zip_content(invoice_numbers),
        filename=f"{username}_invoices_from_{invoice_numbers[0]}.zip",
        content_type="application/zip",
    )


def dummy_production_data(
    username: str,
    first_timestamp_utc: AwareDatetime,
    last_timestamp_utc: AwareDatetime,
) -> CustomerProductionData:

    nhours = round(
        (last_timestamp_utc - first_timestamp_utc) / datetime.timedelta(hours=1)
    )
    maturity_options = ["H2", "H3", "HP", "HC", None]

    return CustomerProductionData(
        data=[
            ContractProductionData(
                contract_name=contract.contract_number,
                first_timestamp_utc=first_timestamp_utc,
                last_timestamp_utc=last_timestamp_utc,
                foreseen_kwh=[i % 24 + j for i in range(nhours)],
                measure_kwh=[j * (i % 24) + 6 for i in range(nhours)],
                estimated=[False for i in range(nhours)],
                maturity=[
                    maturity_options[i % len(maturity_options)] for i in range(nhours)
                ],
            )
            for j, contract in enumerate(dummy_installation_list(username))
        ],
    )


class DummyBackend:
    def user_info(self, login: str) -> TokenUser | None:
        return dummy_user_info(login)

    def profile_info(self, user_info: dict) -> UserProfile:
        return dummy_profile_info(user_info)

    def sign_document(self, username: str, document: str) -> SignatureResult:
        return dummy_sign_document(username, document)

    def installation_list(self, username: str) -> list[InstallationSummary]:
        return dummy_installation_list(username)

    def installation_details(
        self, username: str, contract_number: str
    ) -> InstallationDetailsResult:
        return dummy_installation_details(username, contract_number)

    def invoice_list(self, username: str) -> list[Invoice]:
        return dummy_invoices(username)

    def invoice_pdf(self, username: str, invoice_number: str) -> InvoicePdf:
        return dummy_invoice_pdf(username, invoice_number)

    def invoices_zip(self, username: str, invoice_numbers: []) -> InvoicesZip:
        return dummy_invoices_zip(username, invoice_numbers)

    def production_data(
        self,
        username: str,
        first_timestamp_utc: AwareDatetime,
        last_timestamp_utc: AwareDatetime,
    ) -> CustomerProductionData:
        return dummy_production_data(username, first_timestamp_utc, last_timestamp_utc)
