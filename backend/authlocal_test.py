
import unittest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from yamlns import ns
import os
from somutils.testutils import sandbox_dir, enterContext
from .authlocal import setup_authlocal

class AuthLocal_Test(unittest.TestCase):

    from yamlns.testutils import assertNsEqual
    from somutils.testutils import enterContext

    def setUp(self):
        self.maxDiff = None
        self.sandbox = self.enterContext(sandbox_dir())
        (self.sandbox / '.env').write_text(
            """ERP_PROVISIONING_APIKEY="PROPER_KEY"\n"""
        )
        app = FastAPI()
        setup_authlocal(app)
        self.client = TestClient(app)
        os.environ['ERP_PROVISIONING_APIKEY']='PROPER_KEY'

    def assertResponseEqual(self, response, expected, status=200):
        if type(expected) == str:
            data = ns.loads(expected)

        self.assertNsEqual(
            ns(
                # TODO: Edge cases with response.text not being yaml or json
                yaml=ns.loads(response.text),
                status=response.status_code,
            ),
            ns(
                yaml=data,
                status=status,
            ),
        )

    def passwords(self):
        try:
            return ns.load('passwords.yaml')
        except:
            return ns()

    def test_provisioning__proper(self):
        self.assertNotIn('myuser', self.passwords())

        r = self.client.post(**ns.loads("""\
            url: /api/auth/provisioning
            json:
                username: myuser
                password: mypassword
            headers:
                x-api-key: PROPER_KEY
        """))
        self.assertResponseEqual(r, f"""
            result: ok
        """)

        self.assertIn('myuser', self.passwords())

    def test_provisioning__wrongKey(self):
        r = self.client.post(**ns.loads("""\
            url: /api/auth/provisioning
            json:
                username: myuser
                password: mypassword
            headers:
                x-api-key: BAD_KEY
        """))
        self.assertResponseEqual(r, f"""
            detail: Invalid key
        """, 401)

    def test_provisioning__missingParam(self):
        r = self.client.post(**ns.loads("""\
            url: /api/auth/provisioning
            json:
                # username: myuser <- This one removed
                password: mypassword
            headers:
                x-api-key: PROPER_KEY
        """))
        self.assertResponseEqual(r, """\
            detail:
            - input: null
              loc:
              - body
              - username
              msg: Field required
              type: missing
              url: 'https://errors.pydantic.dev/2.4/v/missing'
        """, 422)

    def test_provisioning__disabledProvisioning(self):
        # This disables provisioning
        os.environ['ERP_PROVISIONING_APIKEY']=''
        r = self.client.post(**ns.loads("""\
            url: /api/auth/provisioning
            json:
                username: myuser
                password: mypassword
            headers:
                x-api-key: PROPER_KEY
        """))
        self.assertResponseEqual(r, f"""
            detail: Disabled key
        """, 401)

    def test_provisioning__withoutKey_notAuthenticated(self):
        r = self.client.post(**ns.loads("""\
            url: /api/auth/provisioning
            data:
                username: myuser
                password: mypassword
        """))
        self.assertResponseEqual(r, f"""
            detail: Not authenticated
        """, 403)



