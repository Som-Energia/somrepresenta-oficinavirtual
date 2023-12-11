import os
import unittest
import dotenv
from .utils.testutils import environ
from .erp import Erp, ErpConnectionError


class Erp_Test(unittest.TestCase):
    from somutils.testutils import enterContext

    def setUp(self):
        self.enterContext(environ('ERP_BASEURL', 'http://noexisto.com'))
        self.enterContext(environ('ERP_DATABASE', 'mydatabase'))
        self.enterContext(environ('ERP_USERNAME', 'myuser'))
        self.enterContext(environ('ERP_PASSWORD', 'mypassword'))

    def test_connection_error(self):
        with environ('ERP_BASEURL', 'http://noexisto.com'):
            with self.assertRaises(ErpConnectionError) as ctx:
                Erp().customer_list()
            self.assertEqual(str(ctx.exception), "[Errno -2] Name or service not known")

    def test_(self):
        dotenv.load_dotenv('.env')
        with self.assertRaises(ErpConnectionError) as ctx:
            Erp().customer_list()
        self.assertEqual(str(ctx.exception), "[Errno -2] Name or service not known")

