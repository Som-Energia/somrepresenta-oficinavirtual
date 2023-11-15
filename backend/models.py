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

