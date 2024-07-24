import httpx
from yamlns import ns
import os
from pydantic import (
    BaseModel,
    AwareDatetime,
    EmailStr,
    UUID4,
)

debug = True

class NewUser(BaseModel):
    username: str
    name: str
    is_active: bool
    last_login: AwareDatetime
    groups: list[UUID4]
    email: EmailStr
    attributes: dict
    path: str
    type: str


class UserProvision:

    def _api(self, url, payload=None, method=None):
        BASE_URL=os.environ.get("AUTHENTIK_API_URL")
        TOKEN=os.environ.get("AUTHENTIK_TOKEN")
        full_url = f"{BASE_URL}/api/v3/{url}"
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': f"Bearer {TOKEN}"
        }
        method = method if method is not None else "POST" if payload else "GET"
        #debug and print(f"{method} {full_url}\n{payload and ns(payload).dump()}")

        response = httpx.request(method, full_url, headers=headers, data=payload)

        response.raise_for_status()

        print('RESPONSE:',response.text)
        return response.json() if response.text else None


    def version(self):
        return self._api("admin/version/")


    def retrieve(self, user_id):
        try:
            return self._api(f"core/users/{user_id}/", payload={}, method="GET")
        except httpx.HTTPError as e:
            if e.response.status_code == 404:
                return None
            raise

    def create(self, user: NewUser):
        try:
            return self._api(f"core/users/", payload=user.json(), method="POST")
        except httpx.HTTPError as e:
            print(e.response.status_code, e.response.text)
            raise

    def remove(self, user_id):
        try:
            return self._api(f"core/users/{user_id}/", payload={}, method="DELETE")
        except httpx.HTTPError as e:
            if e.response.status_code == 404:
                return None
            raise
