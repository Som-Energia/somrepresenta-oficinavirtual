from yamlns import ns
from pydantic import BaseModel
from typing import Literal
import enum

# TODO: Use an enum
Role = Literal[
    'customer',
    'staff',
]

class TokenUser(BaseModel):
    """Minimal user info stored in the jwt token"""
    username: str
    vat: str
    name: str
    email: str
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
    proxy_nif: str | None = None

