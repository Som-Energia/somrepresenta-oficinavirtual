from yamlns import ns
from pydantic import BaseModel

class TokenUser(BaseModel):
    """Minimal user info stored in the jwt token"""
    nif: str
    name: str
    email: str
    roles: list[str]

    def data(self):
        return ns(
            self,
            sub=self.nif,
            username=self.nif,
        )

class UserProfile(TokenUser):
    avatar: str | None
    address: str
    city: str
    zip: str
    state: str
    phone: str
    proxy_name: str | None
    proxy_nif: str | None

