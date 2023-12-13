import unittest
from fastapi import FastAPI, status
from fastapi.testclient import TestClient
from yamlns import ns
from pathlib import Path
from . import __version__ as api_version
from .api_base import setup_base, setup_statics


def setup_test_entry_points(app):
    @app.get('/test/validation')
    def api_validation(parameter: int):
        return dict(result='ok')

    @app.get('/test/unexpected')
    def api_unexpected():
        raise Exception("Exepction message")

class VersionApi_Test(unittest.TestCase):

    from .utils.testutils import assertResponseEqual

    def setUp(self):
        self.maxDiff = None
        self.app = FastAPI()
        setup_base(self.app)
        setup_test_entry_points(self.app)
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

    def test_validation_error(self):
        r = self.client.get('/test/validation?parameter=notanint')
        self.assertResponseEqual(r, f"""
            detail:
            - input: notanint
              loc:
              - query
              - parameter
              msg: Input should be a valid integer, unable to parse string as an integer
              type: int_parsing
              url: https://errors.pydantic.dev/2.4/v/int_parsing
        """, status. HTTP_422_UNPROCESSABLE_ENTITY)

    def test_unexpected_error(self):
        r = self.client.get('/test/unexpected')
        self.assertResponseEqual(r, f"""
            detail:
            - input: notanint
              loc:
              - query
              - parameter
              msg: Input should be a valid integer, unable to parse string as an integer
              type: int_parsing
              url: https://errors.pydantic.dev/2.4/v/int_parsing
        """, status. HTTP_422_UNPROCESSABLE_ENTITY)

