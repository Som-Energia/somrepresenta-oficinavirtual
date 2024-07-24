import unittest
from .user_provision import UserProvision, NewUser
from dotenv import load_dotenv
import os
import datetime

class UserProvision_Test(unittest.TestCase):
    from yamlns.testutils import assertNsEqual, assertNsContains

    non_existing_id = 'should_not_exist_from_somrepre'
    username = 'my_temporary_test_from_somrepre'
    fullname = "SomRepre Test User"

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
        
    def test__get_by_username__non_existing__returns_none(self):
        result = self.api.get_by_username(self.non_existing_id)
        self.assertIsNone(result)
        
    def test__create_and_delete(self):

        new_user = self.api.create(NewUser(
            username=self.username,
            name=self.fullname,
            is_active=True,
            last_login=datetime.datetime.now(datetime.timezone.utc) ,
            groups=[self.group],
            email="a@a.net",
            attributes={},
            path="algo",
            type="internal",
        ))
        id = new_user['pk']
        result = self.api.get_by_username(self.username)
        self.assertIsNotNone(result)
        self.assertEqual(result.get('name'), self.fullname)
        self.api.remove(id)
        result = self.api.get_by_username(self.username)
        self.assertIsNone(result)

    def test__update_user(self):

        new_user = self.api.create(NewUser(
            username=self.username,
            name=self.fullname,
            is_active=True,
            last_login=datetime.datetime.now(datetime.timezone.utc) ,
            groups=[self.group],
            email="a@a.net",
            attributes={},
            path="algo",
            type="internal",
        ))
        self.api.update(self.username, 
            name="Changed full name",
            email="b@b.net",
        )
        result = self.api.get_by_username(self.username)
        self.assertNsContains(result, f"""
            username: {self.username}
            name: Changed full name
            email: b@b.net
        """)

    def test__provision_user__when_new_user__creates(self):
        self.api.provision_user(
            username=self.username,
            name=self.fullname,
            email="a@a.net",
            password="muyimportante",
        )
        retrieved = self.api.get_by_username(self.username)
        self.assertIsNotNone(retrieved)
        self.assertNsContains(retrieved, f"""
            username: {self.username}
            name: {self.fullname}
            email: a@a.net
        """)

    def _test__provision_user__when_all_ok__sets_attributes_and_password(self):
        existing_user = self.api.create(NewUser(
            username=self.username,
            name=self.fullname,
            is_active=True,
            last_login=datetime.datetime.now(datetime.timezone.utc),
            groups=[self.group],
            email="a@a.net",
            attributes={},
            path="algo",
            type="internal",
        ))

        self.api.provision_user(
            username=self.username,
            name="Changed name", # This changes
            email="b@b.net", # This changes
            password="muyimportante",
        )
        retrieved = self.api.get_by_username(self.username)
        self.assertNsContains(retrieved, f"""
            username: {self.username}
            name: Changed name
            email: b@b.net
        """)


    def test__provision_user__when_not_in_group__adds_to_group(self): ""
    def test__provision_user__when_not_active__activates(self): ""

