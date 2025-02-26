import httpx
import dotenv
import os
from decorator import decorator
from typing import Dict, Any, Optional
from pydantic import AwareDatetime

# TODO: Please do not let this evolve without major refactor!
# TODO: This is a quick proof of concept
# TODO; Use erppeek, connection pool management, transactions...

ERP_DEFAULT_TIMEOUT_SECONDS = 5
ERP_INVOICE_ZIP_TIMEOUT_SECONDS = 30

@decorator
def requires_token(f, self, *args, **kwds):
    if not self._token:
        self.token()
    return f(self, *args, **kwds)


class ErpConnectionError(Exception):
    pass


class ErpTimeoutError(Exception):
    pass


class ErpUnexpectedError(Exception):
    def __init__(self, remote_error, remote_traceback):
        self.remote_error = remote_error
        self.remote_traceback = remote_traceback
        super(ErpUnexpectedError, self).__init__(
            f"Unexpected Error inside ERP: {remote_error}\n"
            f"{''.join(remote_traceback)}"
        )


class Erp:
    def __init__(self):
        self.baseurl = os.environ["ERP_BASEURL"]
        self.db = os.environ["ERP_DATABASE"]
        self.user = os.environ["ERP_USERNAME"]
        self.password = os.environ["ERP_PASSWORD"]
        self._token = None
        self.debug = os.environ.get("ERP_DEBUG", 'False').lower() in ('true', '1', 't')


    def _post(self, endpoint, *args, timeout=ERP_DEFAULT_TIMEOUT_SECONDS):
        if self.debug: print(">>", endpoint, args)
        try:
            r = httpx.post(self.baseurl + endpoint, json=list(args), timeout=timeout)
        except httpx.ReadTimeout as e:
            raise ErpTimeoutError(str(e))
        except httpx.ConnectError as e:
            raise ErpConnectionError(str(e))
        r.raise_for_status()
        result = r.json()
        if self.debug: print("<<", r.status_code, endpoint, result)

        # ERP error before getting in our ERP callback sandbox
        if r.status_code == 210:
            raise ErpUnexpectedError(
                remote_error=result.get("exception", "Unknown exception"),
                remote_traceback=result.get("traceback"),
            )
        return result

    def token(self):
        self._token = self._post("/common", "token", self.db, self.user, self.password)

    @requires_token
    def object_execute(self, *args, timeout=10):
        return self._post("/object", "execute", self.db, "token", self._token, *args, timeout=timeout)

    def customer_list(self):
        ids = self.object_execute("somre.ov.users", "search", [["vat", "<>", False]])
        return self.object_execute("somre.ov.users", "read", ids, ["name", "vat"])

    def staff_list(self):
        ids = self.object_execute("res.users", "search", [["id", "<>", False]])
        return self.object_execute(
            "res.users",
            "read",
            ids,
        )  # ['login', 'name'])

    def identify(self, login):
        return self.object_execute("somre.ov.users", "identify_login", login)

    def profile(self, username):
        return self.object_execute("somre.ov.users", "get_profile", username)

    def sign_document(self, username, document):
        return self.object_execute("somre.ov.users", "sign_document", username, document)

    def list_signatures(self, username, document=None):
        """Only for debug purposes"""
        document_query = (
            [["document_version.type.code", "=", document]] if document else []
        )
        ids = self.object_execute(
            "somre.ov.signed.document",
            "search",
            [["signer.vat", "=", username]] + document_query,
        )
        signatures = self.object_execute("somre.ov.signed.document", "read", ids)
        return signatures

    def clear_signatures(self, username, document=None):
        """Only for debug purposes"""
        document_query = (
            [["document_version.type.code", "=", document]] if document else []
        )
        ids = self.object_execute(
            "somre.ov.signed.document",
            "search",
            [["signer.vat", "=", username]] + document_query,
        )
        deleted = self.object_execute("somre.ov.signed.document", "read", ids)
        self.object_execute("somre.ov.signed.document", "unlink", ids)
        return deleted

    def list_installations(self, username):
        return self.object_execute(
            "somre.ov.installations", "get_installations", username
        )

    def installation_details(self, username, contract_number):
        details = self.object_execute(
            "somre.ov.installations",
            "get_installation_details",
            username,
            contract_number,
        )
        return details

    def list_invoices(self, username: str) -> dict:
        return self.object_execute("somre.ov.invoices", "get_invoices", username)

    def invoice_pdf(self, username: str, invoice_number: str) -> dict:
        return self.object_execute(
            "somre.ov.invoices", "download_invoice_pdf", username, invoice_number
        )

    def invoices_zip(self, username: str, invoice_numbers: list[str]) -> dict:
        return self.object_execute(
            "somre.ov.invoices", "download_invoices_zip", username, invoice_numbers,
            timeout=ERP_INVOICE_ZIP_TIMEOUT_SECONDS,
        )

    def production_data(
        self,
        username: str,
        first_timestamp_utc: AwareDatetime,
        last_timestamp_utc: AwareDatetime,
        contract_number: Optional[str] = None
    ) -> Dict[str, Any]:
        data = self.object_execute(
            "somre.ov.production.data",
            "measures_single_installation",
            username,
            str(contract_number),
            str(first_timestamp_utc),
            str(last_timestamp_utc),
        )
        return data


def example():
    dotenv.load_dotenv(".env")
    e = Erp()
    e.token()
    for staff in e.staff_list():
        print(staff)
    for partner in e.customer_list():
        print(e.identify(partner["vat"]))
        print(e.profile(partner["vat"]))


if __name__ == "__main__":
    example()
