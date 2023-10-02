import unittest
from fastapi.testclient import TestClient
from . import __version__ as api_version
from . import api
from yamlns import ns

class VersionApi_Test(unittest.TestCase):

    from yamlns.testutils import assertNsEqual

    def setUp(self):
        self.maxDiff = None
        self.client = TestClient(api.app)

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

    def test_version(self):
        r = self.client.get('/api/version')
        self.assertResponseEqual(r, f"""
            version: {api_version}
        """)
 
