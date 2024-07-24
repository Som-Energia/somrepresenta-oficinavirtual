import unittest
from .user_provision import UserProvision, NewUser
from dotenv import load_dotenv
import os
import datetime

class UserProvision_Test(unittest.TestCase):
    from yamlns.testutils import assertNsEqual

    non_existing_id = 'should_not_exist_from_somrepre'
    username = 'my_temporary_test_from_somrepre'

    def setUp(self):
        # TODO: restore environment after tests
        load_dotenv()
        self.group = os.environ.get("AUTHENTIK_GROUP_ID")
        self.api = UserProvision()

    def tearDown(self):
        id = self.api.get_id_by_username(self.username)
        if id: self.api.remove(id)

    def test__version__returns_current(self):
        result = self.api.version()
        self.assertIn('version_current', result)
        
    def test__retrieve__non_existing__returns_none(self):
        result = self.api.retrieve(self.non_existing_id)
        self.assertIsNone(result)
        
    def test__create_and_delete(self):

        new_user = self.api.create(NewUser(
            username=self.username,
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
        result = self.api.retrieve(self.username)
        self.assertIsNotNone(result)
        self.assertEqual(result.get('name'), "Non Existing User")
        self.api.remove(id)
        result = self.api.retrieve(self.username)
        self.assertIsNone(result)




