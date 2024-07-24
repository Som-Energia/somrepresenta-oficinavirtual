import httpx
from yamlns import ns
import os
import datetime
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

    def _api(self, url, payload=None, params=None, json=None, method=None):
        BASE_URL=os.environ.get("AUTHENTIK_API_URL")
        TOKEN=os.environ.get("AUTHENTIK_TOKEN")
        full_url = f"{BASE_URL}/api/v3/{url}"
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': f"Bearer {TOKEN}"
        }
        method = method if method is not None else "POST" if payload or json else "GET"
        debug and print(f"{method} {full_url}\n{payload or json}")

        response = httpx.request(method, full_url, json=json, params=params, headers=headers, data=payload)
        print('RESPONSE:', response.status_code, response.text)
        response.raise_for_status()

        return response.json() if response.text else None


    def version(self):
        return self._api("admin/version/")

    def add_group(self, name):
        return self._api("core/groups/", json={'name': name}, method="POST")['pk']

    def remove_group(self, group_id):
        self._api(f"core/groups/{group_id}/", payload={}, method="DELETE")

    def add_user_to_group(self, user_id, group_id):
        self._api(f"core/groups/{group_id}/add_user/", json={'pk': user_id}, method="POST")

    def get_by_username(self, username):
        try:
            result = self._api(f"core/users/", params={'username':username}, method="GET")
        except httpx.HTTPError as e:
            if e.response.status_code == 404:
                return None
            raise
        if not result.get('results'): return None
        return result['results'][0]

    def create(self, user: NewUser):
        try:
            return self._api(f"core/users/", payload=user.model_dump_json(), method="POST")
        except httpx.HTTPError as e:
            print(e.response.status_code, e.response.text)
            raise

    def update(self, username, **kwds):
        user_id = self.get_id_by_username(username)
        try:
            return self._api(f"core/users/{user_id}/", json=kwds, method="PATCH")
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

    def get_id_by_username(self, username):
        try:
            result = self._api(f"core/users/", params={'username':username}, method="GET")
        except httpx.HTTPError as e:
            if e.response.status_code == 404:
                return None
            raise
        if not result.get('results'): return None
        return result['results'][0]['pk']

    def provision_user(self, username, name, email, password):
        id = self.get_id_by_username(username)
        if id:
            self.update(
                username=username,
                name=name,
                email=email,
                groups=[os.environ.get("AUTHENTIK_GROUP_ID")],
            )
            return

        self.create(NewUser(
            username=username,
            name=name,
            email=email,
            groups=[os.environ.get("AUTHENTIK_GROUP_ID")],
            is_active=True,
            type="internal",
            last_login=datetime.datetime.now(datetime.timezone.utc),
            path="REVIEWME",
            attributes={},
        ))

# This implementation uses the official authentik python client
# But importing the library slows down feedback loop for tests a lot!!!.
# Commented out just in case future releases solve this problem.
"""
from authentik_client.api_client import ApiClient
from authentik_client.api.core_api import CoreApi
from authentik_client.configuration import Configuration
from authentik_client.rest import ApiException
from pprint import pprint
class UserProvision_Lib:
    def __init__(self):
        BASE_URL=os.environ.get("AUTHENTIK_API_URL")
        TOKEN=os.environ.get("AUTHENTIK_TOKEN")

        self.configuration = Configuration(
            host = f"{BASE_URL}/api/v3",
            access_token = TOKEN
        )

    def retrieve(self, user_id):
        with ApiClient(self.configuration) as api_client:
            api_instance = CoreApi(api_client)

            try:
                return api_instance.core_users_retrieve(id=user_id).model_dump()
                print("The response of AdminApi->admin_apps_list:\n")
                pprint(api_response)
            except ApiException as e:
                print("Exception when calling AdminApi->admin_apps_list: %s\n" % e)
"""
