import os
import unittest
from fastapi import FastAPI, Depends
from fastapi.testclient import TestClient
from yamlns import ns
from consolemsg import error
from somutils.testutils import sandbox_dir
import unittest.mock
from .authlocal import setup_authlocal
from .auth import validated_user, oauth2, setup_auth
from .utils.testutils import environ

def setup_profile(app):
    """Mount testing only purpose api entries"""

    @app.get('/api/me')
    def profile(user: dict = Depends(validated_user)) -> dict:
        return user

class AuthLocal_Test(unittest.TestCase):

    from yamlns.testutils import assertNsEqual
    from somutils.testutils import enterContext
    from .utils.testutils import assertResponseEqual

    username = 'ES12345678Z'
    password = 'mypassword'
    apikey = 'PROPER_KEY'

    def setUp(self):
        self.maxDiff = None
        self.sandbox = self.enterContext(sandbox_dir())
        self.enterContext(environ('ERP_PROVISIONING_APIKEY', self.apikey))
        self.enterContext(environ('JWT_SECRET', "whatever"))
        self.enterContext(environ('JWT_EXPIRES', "2000"))
        self.enterContext(environ('DATA_BACKEND', "dummy"))
        app = FastAPI()
        setup_auth(app)
        setup_authlocal(app)
        setup_profile(app)
        self.client = TestClient(app)

    def passwords(self):
        try:
            return ns.load('passwords.yaml')
        except:
            return ns()

    def provisioning_query(
        self,
        username = username,
        password = password,
        key = 'PROPER_KEY',
    ):
        query = ns(
            json=ns(
                username=username,
                password=password,
            ),
            headers=ns((
                ('x-api-key', key),
            )),
        )
        if key is None: del query['headers']
        if username is None: del query.json['username']
        if password is None: del query.json['password']

        return self.client.post(
            '/api/auth/provisioning',
            **query
        )

    def login_query(self, username=username, password=password):
        return self.client.post(
            '/api/auth/token',
            data=dict(
                username=username,
                password=password,
            ),
        )

    def profile_query(self):
        return self.client.get(
            '/api/me',
        )

    def logout_query(self):
        return self.client.post(
            '/api/auth/logout',
        )

    def test_provisioning__proper(self):
        self.assertNotIn(self.username, self.passwords())

        r = self.provisioning_query()
        self.assertResponseEqual(r, f"""
            result: ok
        """)

        self.assertIn(self.username, self.passwords())

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
        del os.environ['ERP_PROVISIONING_APIKEY']
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
        r = self.provisioning_query()
        self.assertResponseEqual(r, "result: ok")

        r = self.login_query()

        token = safe_response_get(r, 'access_token')
        self.assertResponseEqual(r, f"""\
            access_token: {token}
            token_type: bearer
        """)

        self.assertEqual(
            r.cookies.get('Authorization'),
            f'"Bearer {token}"', # TODO: Why the quotes!???
        )

    def test_login__proper_with_nif_instead_vat(self):
        r = self.provisioning_query()
        self.assertResponseEqual(r, "result: ok")

        r = self.login_query(self.username[2:]) # removing ES

        token = safe_response_get(r, 'access_token')
        self.assertResponseEqual(r, f"""\
            access_token: {token}
            token_type: bearer
        """)

        self.assertEqual(
            r.cookies.get('Authorization'),
            f'"Bearer {token}"', # TODO: Why the quotes!???
        )

    def test_logout__proper(self):
        r = self.provisioning_query()
        self.assertResponseEqual(r, "result: ok")

        r = self.login_query()
        r = self.logout_query()
        self.assertEqual(
            r.cookies.get('Authorization'),
            None,
        )

    def test_login__userNotFound(self):
        with unittest.mock.patch('backend.authlocal.user_info') as mock:
            mock.return_value = None

            r = self.login_query()
            self.assertResponseEqual(r, f"""\
                detail: Incorrect username
            """, 401)

    def test_login__unprovisionedUser(self):
        r = self.login_query()
        self.assertResponseEqual(r, f"""\
            detail: Incorrect password
        """, 401)

    def test_login__wrongPassword(self):
        r = self.provisioning_query()
        r = self.login_query(password='WRONG PASSWORD')
        self.assertResponseEqual(r, f"""\
            detail: Incorrect password
        """, 401)

    @unittest.skip("Still not working")
    def test_self_profile(self):
        r = self.provisioning_query()
        print("after provision", self.client.cookies)
        r = self.login_query()
        print("after login", self.client.cookies)
        r = self.profile_query()
        print("afger profile", self.client.cookies)
        self.assertResponseEqual(r, f"""\
            lala: boo
        """)



