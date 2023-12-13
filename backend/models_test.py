import unittest
from yamlns import ns
from pydantic import (
    BaseModel,
    ValidationError,
)
from .models import (
    VatNumber,
    TokenUser,
)
from .utils.testutils import pydantic_minor_version

class Myclass(BaseModel):
    vat: VatNumber


class VatNumber_Test(unittest.TestCase):
    from yamlns.testutils import assertNsEqual

    def setUp(self):
        self.maxDiff = None

    def test_validate__spanish_vat(self):
        o = Myclass(vat='ES12345678Z')
        self.assertNsEqual(o.model_dump(), """
            vat: ES12345678Z
        """)

    def test_validate__with_bad_vat(self):
        with self.assertRaises(ValidationError) as ctx:
            Myclass(vat='badvat')
        self.assertNsEqual(ctx.exception.json(), f"""
            data:
            - ctx:
                error: One of the parts of the number are invalid or unknown.
              input: badvat
              loc:
              - vat
              msg: Value error, One of the parts of the number are invalid or unknown.
              type: value_error
              url: https://errors.pydantic.dev/{pydantic_minor_version}/v/value_error
        """)

class TokenUser_Test(unittest.TestCase):
    from yamlns.testutils import assertNsEqual

    def setUp(self):
        self.maxDiff = None

    def test_validate__minimal_fields(self):
        o = TokenUser(**ns.loads("""
            vat: ES12345678Z
            username: ES12345678Z
            name: A name
            email: name@server.com
            roles: []
            avatar: 'http://server.com/avatar.png'
        """))
        self.assertNsEqual(o.model_dump(), """
            avatar: 'http://server.com/avatar.png'
            vat: ES12345678Z
            username: ES12345678Z
            name: A name
            email: name@server.com
            roles: []
        """)

    def test_validate__no_fields__requires_minimal(self):
        with self.assertRaises(ValidationError) as ctx:
            TokenUser()
        self.assertNsEqual(ctx.exception.json(), f"""
            data:
            - input: {{}}
              loc:
              - username
              msg: Field required
              type: missing
              url: https://errors.pydantic.dev/{pydantic_minor_version}/v/missing
            - input: {{}}
              loc:
              - vat
              msg: Field required
              type: missing
              url: https://errors.pydantic.dev/{pydantic_minor_version}/v/missing
            - input: {{}}
              loc:
              - name
              msg: Field required
              type: missing
              url: https://errors.pydantic.dev/{pydantic_minor_version}/v/missing
            - input: {{}}
              loc:
              - email
              msg: Field required
              type: missing
              url: https://errors.pydantic.dev/{pydantic_minor_version}/v/missing
            - input: {{}}
              loc:
              - roles
              msg: Field required
              type: missing
              url: https://errors.pydantic.dev/{pydantic_minor_version}/v/missing
            - input: {{}}
              loc:
              - avatar
              msg: Field required
              type: missing
              url: https://errors.pydantic.dev/{pydantic_minor_version}/v/missing
        """)


