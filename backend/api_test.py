import unittest
from fastapi import status
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

    def test_missing_file(self):
        r = self.client.get('/missing_file')
        self.assertResponseEqual(r, f"""
            detail: Not Found
        """, status.HTTP_404_NOT_FOUND)

    def test_bad_method(self):
        r = self.client.post('/')
        self.assertResponseEqual(r, f"""
            detail: Method Not Allowed
        """, status.HTTP_405_METHOD_NOT_ALLOWED)

