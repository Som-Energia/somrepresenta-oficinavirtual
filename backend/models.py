from yamlns import ns
import datetime
from pydantic import (
    BaseModel,
    Field,
    field_validator,
    ValidationInfo,
    AfterValidator,
    EmailStr,
    AwareDatetime,
    Base64Bytes,
)
from typing import Literal, Annotated
import stdnum.eu.vat
import enum

VatNumber = Annotated[
    str,
    AfterValidator(stdnum.eu.vat.validate),
]

# TODO: Use Enums for those literals

Role = Literal[
    'customer',
    'staff',
]

InvoiceConcept = Literal[
    'market',
    'specific_retribution',
    'services',
]

InvoicePaymentStatus = Literal[
    'open',
    'paid',
    'unpaid',
]

BillingMode = Literal[
    'atr',
    'index',
]

RepresentationType = Literal[
    'directa_cnmc',
    'indirecta_cnmc',
]

ProductionTechnology = Literal[
    'b11', # Photovoltaic
    'b41', # Hidraulic
    'b42', # Hidraulic
]

DeviationIncluded = Literal[
    'included',
    'not_included',
]

ContractStatus = Literal[
    'esborrany',
    'validar',
    'pendent',
    'activa',
    'cancelada',
    'contracte',
    'novapolissa',
    'modcontractual',
    'impagament',
    'tall',
    'baixa',
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
    technology: ProductionTechnology | bool | None # TODO: restrict to enum # TODO: Remove bool when fixed in ERP
    type: str # TODO: Rename to installaton_type_code

class ContractDetails(BaseModel):
    billing_mode: BillingMode
    cost_deviation: DeviationIncluded
    discharge_date: datetime.date
    iban: str
    proxy_fee: float
    reduction_deviation: int
    representation_type: RepresentationType
    status: ContractStatus

class InstallationDetailsResult(BaseModel):
    installation_details: InstallationDetails
    contract_details: ContractDetails

class Invoice(BaseModel):
    invoice_number: str
    contract_number: str
    emission_date: datetime.date
    first_period_date: datetime.date
    last_period_date: datetime.date
    amount: float
    concept: InvoiceConcept | None = None
    liquidation: str | None = None
    payment_status: InvoicePaymentStatus

class InvoicePdf(BaseModel):
    content: Base64Bytes
    content_type: str # TODO: content type check
    filename: str

class InvoicesZip(BaseModel):
    content: Base64Bytes
    content_type: str # TODO: content type check
    filename: str

class ProductionData(BaseModel):
    data: str
    value: int

DataMaturity = Literal[
    'H2',
    'H3',
    'HP',
    'HC',
]

class ContractProductionData(BaseModel):
    contract_name: str
    first_timestamp_utc: AwareDatetime
    last_timestamp_utc: AwareDatetime
    foreseen_kwh: list[float | None]
    measure_kwh: list[float | None]
    estimated: list [bool | None]
    maturity: list[DataMaturity | None]

class CustomerProductionData(BaseModel):
    data: list[ContractProductionData]

