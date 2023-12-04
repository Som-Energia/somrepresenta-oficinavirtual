import unittest
from fastapi.testclient import TestClient
from yamlns import ns
from . import __version__ as api_version
from . import api

class VersionApi_Test(unittest.TestCase):

    from .utils.testutils import assertResponseEqual

    def setUp(self):
        self.maxDiff = None
        self.client = TestClient(api.app)

    def test_version(self):
        r = self.client.get('/api/version')
        self.assertResponseEqual(r, f"""
            version: {api_version}
        """)

