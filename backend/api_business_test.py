import unittest
from fastapi import FastAPI, Depends, status
from fastapi.testclient import TestClient
from yamlns import ns
from consolemsg import error
from somutils.testutils import sandbox_dir
import unittest.mock
from .auth.authlocal import setup_authlocal
from .api_business import setup_business
from .utils.testutils import environ, safe_response_get

class ApiBusiness_Test(unittest.TestCase):

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
        setup_authlocal(app)
        setup_business(app)
        self.client = TestClient(app)

    def provisioning_query(
        self,
        username = username,
        password = password,
        key = 'PROPER_KEY',
    ):
        query = ns(json=ns())
        if username is not None:
            query.json['username'] = username

        if password is not None:
            query.json['password'] = password

        if key is not None:
            query['headers'] = ns((
                ('x-api-key', key),
            ))

        return self.client.post(
            '/api/auth/provisioning',
            **query
        )

    def login_query(self, username=username, password=password):
        r = self.client.post(
            '/api/auth/token',
            data=dict(
                username=username,
                password=password,
            ),
        )
        # TODO: Why this is needed at all? Authorization was already
        # TODO: in client but does not send it unless we do that
        self.client.cookies.set('Authorization', r.cookies.get('Authorization'))
        return r

    def protected_api(self):
        return self.client.get(
            '/api/test_protected',
        )

    def profile_query(self):
        return self.client.get(
            '/api/me',
        )

    def logout_query(self):
        return self.client.post(
            '/api/auth/logout',
        )

    def test_erp_connection_error(self):
        r = self.provisioning_query()
        r = self.login_query()
        with (
            environ('DATA_BACKEND', 'erp'),
            environ('ERP_BASEURL', 'http://noexisto.com'),
            environ('ERP_DATABASE', "mydatabase"),
            environ('ERP_USERNAME', "myuser"),
            environ('ERP_PASSWORD', "mypassword"),
        ):
            r = self.client.get('/api/me')
        self.assertResponseEqual(r, """\
            details: Unable to reach ERP
        """, status.HTTP_502_BAD_GATEWAY)

    def test_self_profile(self):
        r = self.provisioning_query()
        r = self.login_query()
        r = self.profile_query()
        self.assertResponseEqual(r, r"""
            vat: ES12345678Z
            address: Rue del Percebe, 13
            avatar: https://www.gravatar.com/avatar/1ad4bc8f8707a4fba330f4d1f8353ebc?d=404&s=128
            city: Salt
            email: es12345678z@nowhere.com
            name: Perico Palotes
            phones:
            - '555444333'
            proxy_name: Matute Gonzalez, Frasco
            proxy_vat: ES87654321X
            roles:
            - customer
            signed_documents: []
            state: Girona
            username: ES12345678Z
            zip: '17234'
        """)

