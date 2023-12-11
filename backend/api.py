import os
from fastapi import FastAPI
from dotenv import load_dotenv
from .api_base import setup_base, setup_statics
from .authlocal import setup_authlocal
from .api_business import setup_business

def setup():
    load_dotenv()
    app = FastAPI()
    setup_base(app)
    #setup_auth(app)
    setup_authlocal(app)
    setup_business(app)
    setup_statics(app)
    if os.environ.get("SHOW_ROUTES"):
        [print(r.path) for r in app.routes]
    return app

app = setup()

