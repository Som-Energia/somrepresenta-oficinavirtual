import requests
import os

class UserProvision:

    def _api(self, url, payload=None, method=None):
        BASE_URL=os.environ.get("AUTHENTIK_API_URL")
        TOKEN=os.environ.get("AUTHENTIK_TOKEN")
        full_url = f"{BASE_URL}/api/v3/{url}"
        headers = {
            'Accept': 'application/json',
            'Authorization': f"Bearer {TOKEN}"
        }
        method = method if method is not None else "POST" if payload else "GET"

        response = requests.request(method, full_url, headers=headers, data=payload)
        return response.json()


    def version(self):
        return self._api("admin/version/")




