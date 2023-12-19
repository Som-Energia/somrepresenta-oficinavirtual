from yamlns import ns
from pydantic import (
    BaseModel,
    Field,
    field_validator,
    ValidationInfo,
    AfterValidator,
    EmailStr,
)
from typing import Literal, Annotated
import stdnum.eu.vat
import enum

VatNumber = Annotated[
    str,
    AfterValidator(stdnum.eu.vat.validate),
]

# TODO: Use an enum
Role = Literal[
    'customer',
    'staff',
]

# TODO: Use an enum
InvoiceConcept = Literal[
    'market',
    'specific_retribution',
    'services',
]

class SignatureResult(BaseModel):
    signed_version: str # TODO: Restrict to iso datetime

class SignedDocument(BaseModel):
    document: str
    version: str

class TokenUser(BaseModel):
    """Minimal user info stored in the jwt token"""

    username: str
    vat: VatNumber
    name: str
    email: EmailStr
    roles: list[Role]
    avatar: str | None

    def data(self):
        return ns(
            self,
            sub=self.username,
        )

class UserProfile(TokenUser):
    avatar: str | None = None
    address: str
    city: str
    zip: str
    state: str
    phones: list[str]
    proxy_name: str | None = None
    proxy_vat: VatNumber | None = None
    signed_documents: list[SignedDocument]


class InstallationSummary(BaseModel):
    contract_number: str
    installation_name: str

class InstallationDetails(BaseModel):
    address: str
    cil: str
    city: str
    contract_number: str
    coordinates: str | None = None
    ministry_code: str
    name: str
    postal_code: str
    province: str
    rated_power: int
    technology: str | bool # TODO: restrict to enum
    type: str # TODO: restrict to enum

class ContractDetails(BaseModel):
    billing_mode: str
    cost_deviation: str
    discharge_date: str # TODO: date?
    iban: str
    proxy_fee: float
    reduction_deviation: int
    representation_type: str # TODO: restrict to enum
    status: str # TODO: restrict to enum

class InstallationDetailsResult(BaseModel):
    installation_details: InstallationDetails
    contract_details: ContractDetails

class Invoice(BaseModel):
    invoice_number: str
    contract_number: str
    emission_date: str # TODO date?
    first_period_date: str # TODO date?
    last_period_date: str # TODO date?
    amount: float
    concept: InvoiceConcept | None = None
    liquidation: str | None

class InvoicePdf(BaseModel):
    content: str # TODO: Base64
    content_type: str # TODO: content type check
    filename: str

