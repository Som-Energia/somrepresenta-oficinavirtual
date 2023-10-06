import os
from fastapi_oauth2.middleware import OAuth2Middleware
from fastapi_oauth2.router import router as oauth2_router
from fastapi_oauth2.claims import Claims
from fastapi_oauth2.client import OAuth2Client
from fastapi_oauth2.config import OAuth2Config
from social_core.backends.google import GoogleOAuth2

def on_auth(auth, user):
    print("on_auth", auth, user)
    # TODO: Lookup user in ERP
    # TODO: If new user and require additional data, redirect


def setup_auth(app):
    config = OAuth2Config(
        # Forbids http (not https) queries to access the cookie
        # TODO: Only false for development
        allow_http=False,
        #enable_ssr=False,
        jwt_secret=os.getenv("JWT_SECRET"),
        jwt_expires=os.getenv("JWT_EXPIRES"),
        jwt_algorithm='HS256', # Force
        clients=[
            OAuth2Client(
                backend=GoogleOAuth2,
                client_id=os.getenv("OAUTH2_GOOGLE_CLIENT_ID"),
                client_secret=os.getenv("OAUTH2_GOOGLE_CLIENT_SECRET"),
                scope=["openid", "profile", "email"],
                # TODO: This is required to work with proxy and not always work
                #redirect_uri='/',
                redirect_uri='http://localhost:5173/',
                claims=Claims(
                    identity=lambda user: f"{user.provider}:{user.sub}",
                ),
            ),
        ]
    )

    app.include_router(oauth2_router)
    app.add_middleware(
        OAuth2Middleware,
        config=config,
        callback=on_auth,
    )
