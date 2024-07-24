import unittest
from .user_provision import UserProvision_Old, NewUser
from dotenv import load_dotenv
import os
import datetime

class UserProvision_Test(unittest.TestCase):
    from yamlns.testutils import assertNsEqual

    non_existing_id = 88888888

    def setUp(self):
        # TODO: restore environment after tests
        load_dotenv()
        self.group = os.environ.get("AUTHENTIK_GROUP_ID")

    def test__version__returns_current(self):
        api = UserProvision_Old()
        result = api.version()
        self.assertIn('version_current', result)
        
    def test__retrieve__non_existing__returns_none(self):
        api = UserProvision_Old()
        result = api.retrieve(self.non_existing_id)
        self.assertIsNone(result)
        
    def test__create_and_delete(self):
        api = UserProvision_Old()

        new_user = api.create(NewUser(
            username="non-existing-user",
            name="Non Existing User",
            is_active=True,
            last_login=datetime.datetime.now(datetime.timezone.utc) ,
            groups=[self.group],
            email="a@a.net",
            attributes={},
            path="algo",
            type="internal",
        ))
        id = new_user['pk']
        result = api.retrieve(id)
        self.assertEqual(result.get('name'), "Non Existing User")
        api.remove(id)
        result = api.retrieve(id)
        self.assertIsNone(result)




