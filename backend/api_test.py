import unittest
from fastapi import FastAPI, status
from fastapi.testclient import TestClient
from yamlns import ns
from pathlib import Path
from . import __version__ as api_version
from .api_base import setup_base, setup_statics

class VersionApi_Test(unittest.TestCase):

    from .utils.testutils import assertResponseEqual

    def setUp(self):
        self.maxDiff = None
        self.app = FastAPI()
        setup_base(self.app)
        setup_statics(self.app)
        self.client = TestClient(self.app)

    def test_version(self):
        r = self.client.get('/api/version')
        self.assertResponseEqual(r, f"""
            version: {api_version}
        """)

    def test_static(self):
        # This test will fail if ui not deployed: make ui-deploy
        r = self.client.get('/logo.svg')
        r.raise_for_status()
        self.assertResponseEqual(
            r,
            Path('frontend/public/logo.svg').read_text(),
            content_type='image/svg+xml',
        )

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

