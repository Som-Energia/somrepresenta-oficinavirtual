import httpx
import dotenv
import os
from decorator import decorator

# TODO: Please do not let this evolve without major refactor!
# TODO: This is a quick proof of concept
# TODO; Use erppeek, connection pool management, transactions...

@decorator
def requiresToken(f, self, *args, **kwds):
    try:
        if not self._token:
            self.token()
        return f(self, *args, **kwds)
    except Exception as e:
        raise 

class ErpConnectionError(Exception): pass

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
        self.baseurl = os.environ['ERP_BASEURL']
        self.db = os.environ['ERP_DATABASE']
        self.user = os.environ['ERP_USERNAME']
        self.password = os.environ['ERP_PASSWORD']
        self._token = None

    def _post(self, endpoint, *args):
        print(">>", endpoint, args)
        try:
            r = httpx.post(self.baseurl+endpoint, json=list(args))
        except httpx.ConnectError as e:
            raise ErpConnectionError(str(e))
        r.raise_for_status()
        result = r.json()
        print("<<", r.status_code, endpoint, result)

        # ERP error before getting in our ERP callback sandbox
        if r.status_code == 210:
            raise ErpUnexpectedError(
                remote_error = result.get("exception", "Unknown exception"),
                remote_traceback = result.get("traceback"),
            )
        return result

    def token(self):
        self._token = self._post('/common', 'token', self.db, self.user, self.password)

    @requiresToken
    def object_execute(self, *args):
        return self._post('/object', 'execute', self.db, 'token', self._token, *args)

    def customer_list(self):
        ids = self.object_execute('res.partner', 'search', [['vat','<>', False]])
        return self.object_execute('res.partner', 'read', ids, ['name', 'vat'])

    def staff_list(self):
        ids = self.object_execute('res.users', 'search', [['id','<>', False]])
        return self.object_execute('res.users', 'read', ids,)# ['login', 'name'])

    def identify(self, vat):
        return self.object_execute('som.ov.users', 'identify_login', vat)

    def profile(self, vat):
        return self.object_execute('som.ov.users', 'get_profile', vat)

    def sign_document(self, username, document):
        return self.object_execute('som.ov.users', 'sign_document', username, document)

    def list_signatures(self, username, document=None):
        """Only for debug purposes"""
        document_query = [['document_version.type.code', '=', document]] if document else []
        ids = self.object_execute('som.ov.signed.document', 'search', [['signer.vat', '=', username]]+document_query)
        signatures = self.object_execute('som.ov.signed.document', 'read', ids)
        return signatures

    def clear_signatures(self, username, document=None):
        """Only for debug purposes"""
        document_query = [['document_version.type.code', '=', document]] if document else []
        ids = self.object_execute('som.ov.signed.document', 'search', [['signer.vat', '=', username]]+document_query)
        deleted = self.object_execute('som.ov.signed.document', 'read', ids)
        self.object_execute('som.ov.signed.document', 'unlink', ids)
        return deleted

    def list_installations(self, vat):
        return self.object_execute('som.ov.installations', 'get_installations', vat)

    def installation_details(self, username, contract_number):
        details = self.object_execute(
            "som_ov_installation", "get_installation_details", username, contract_number
        )
        return details


def example():
    dotenv.load_dotenv('.env')
    e = Erp()
    e.token()
    for staff in e.staff_list():
        print(staff)
    for partner in e.customer_list():
        print(e.identify(partner['vat']))
        print(e.profile(partner['vat']))

if __name__ == '__main__':
    example()


