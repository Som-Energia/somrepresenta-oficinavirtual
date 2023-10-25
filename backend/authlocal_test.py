
import unittest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from yamlns import ns
import os
from somutils.testutils import sandbox_dir, enterContext
import unittest.mock
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

    def provisioning_query(
        self,
        username = 'myuser',
        password = 'mypassword',
        key = 'PROPER_KEY',
    ):
        query = ns.loads(f"""\
            url: /api/auth/provisioning
            json:
                username: "{username}"
                password: "{password}"
            headers:
                x-api-key: "{key}"
        """)
        if key is None: del query['headers']
        if username is None: del query.json['username']
        if password is None: del query.json['password']
        return self.client.post(**query)


    def test_provisioning__proper(self):
        self.assertNotIn('myuser', self.passwords())

        r = self.provisioning_query()
        self.assertResponseEqual(r, f"""
            result: ok
        """)

        self.assertIn('myuser', self.passwords())

    def test_provisioning__wrongKey(self):
        r = self.provisioning_query(key="BAD_KEY")
        self.assertResponseEqual(r, f"""
            detail: Invalid key
        """, 401)

    def test_provisioning__missingParam(self):
        r = self.provisioning_query(username=None)
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
        r = self.provisioning_query()
        self.assertResponseEqual(r, f"""
            detail: Disabled key
        """, 401)

    def test_provisioning__withoutKey_notAuthenticated(self):
        r = self.provisioning_query(key=None)
        self.assertResponseEqual(r, f"""
            detail: Not authenticated
        """, 403)

    def test_login__proper(self):
        r = self.provisioning_query(username='12345678Z', password='apassword')
        self.assertResponseEqual(r, "result: ok")

        r = self.client.post(
            '/api/auth/token',
            data=dict(
                username='12345678Z',
                password='apassword',
            ),
        )
        token = r.json().get('access_token', "NOT_FOUND")
        self.assertResponseEqual(r, f"""\
            access_token: {token}
            token_type: bearer
            """)

        self.assertEqual(
            r.cookies.get('Authorization'),
            f'"Bearer {token}"', # TODO: Why the quotes!???
        )

    def test_login__userNotFound(self):
        with unittest.mock.patch('backend.authlocal.user_info') as mock:
            mock.return_value = None

            r = self.client.post(
                '/api/auth/token',
                data=dict(
                    username='12345678Z',
                    password='apassword',
                ),
            )
            self.assertResponseEqual(r, f"""\
                detail: Incorrect username
                """, 401)

    def test_login__unprovisionedUser(self):
        r = self.client.post(
            '/api/auth/token',
            data=dict(
                username='12345678Z',
                password='apassword',
            ),
        )
        self.assertResponseEqual(r, f"""\
            detail: Incorrect password
            """, 401)

    def test_login__wrongPassword(self):
        r = self.provisioning_query(username='12345678Z', password='apassword')
        self.assertResponseEqual(r, "result: ok")

        r = self.client.post(
            '/api/auth/token',
            data=dict(
                username='12345678Z',
                password='WRONG PASSWORD',
            ),
        )
        self.assertResponseEqual(r, f"""\
            detail: Incorrect password
            """, 401)


