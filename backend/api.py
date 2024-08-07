import os
from fastapi import FastAPI
from dotenv import load_dotenv
import sentry_sdk
from .api_base import setup_base, setup_statics
from .auth.authlocal import setup_authlocal
from .auth.authremote import setup_auth
from .api_business import setup_business

def setup():
    load_dotenv()
    if os.environ.get('SENTRY_DSN'):
        sentry_sdk.init(
            dsn=os.environ['SENTRY_DSN'],
            enable_tracing=True,
            environment=os.environ.get('ENV', 'development')
        )
    app = FastAPI()
    setup_base(app)
    setup_auth(app)
    setup_authlocal(app)
    setup_business(app)

    setup_statics(app)
    if os.environ.get("SHOW_ROUTES"):
        [print(f"'{r.path}' - [{r.name}]") for r in app.routes]
    return app


app = setup()


