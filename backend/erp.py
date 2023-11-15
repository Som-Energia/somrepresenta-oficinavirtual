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

class Erp:
    def __init__(self):
        self.baseurl = os.environ['ERP_BASEURL']
        self.db = os.environ['ERP_DATABASE']
        self.user = os.environ['ERP_USERNAME']
        self.password = os.environ['ERP_PASSWORD']
        self._token = None

    def _post(self, endpoint, *args):
        #print("<<", args)
        r = httpx.post(self.baseurl+endpoint, json=list(args))
        r.raise_for_status()
        result = r.json()
        #print(">>", result)
        return result

    def token(self):
        self._token = self._post('common', 'token', self.db, self.user, self.password)

    @requiresToken
    def object_execute(self, *args):
        return self._post('object', 'execute', self.db, 'token', self._token, *args)

    def customer_list(self):
        ids = self.object_execute('res.partner', 'search', [['vat','<>', False]])
        return self.object_execute('res.partner', 'read', ids, ['name', 'vat'])

    def staff_list(self):
        ids = self.object_execute('res.users', 'search', [['id','<>', False]])
        return self.object_execute('res.users', 'read', ids,)# ['login', 'name'])

    def identify(self, vat):
        return self.object_execute('users', 'identify_login', vat)

    def profile(self, vat):
        return self.object_execute('users', 'get_profile', vat)

    def sign_document(self, username, document):
        return self.object_execute('users', 'sign_document', username, document)


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


