import unittest
from .user_provision import UserProvision
from dotenv import load_dotenv


class UserProvision_Test(unittest.TestCase):
    from yamlns.testutils import assertNsEqual
    def setUp(self):
        # TODO: restore environment after tests
        load_dotenv()

    def test(self):
        api = UserProvision()
        result = api.version()
        self.assertIn('version_current', result)
        




