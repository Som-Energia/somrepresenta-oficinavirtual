import os
from typing import Annotated
from fastapi import Depends, HTTPException, status, Body
from fastapi_oauth2.middleware import OAuth2Middleware
from fastapi_oauth2.router import router as oauth2_router
from fastapi_oauth2.claims import Claims
from fastapi_oauth2.client import OAuth2Client
from fastapi_oauth2.config import OAuth2Config
from pydantic import EmailStr
from social_core.backends.google import GoogleOAuth2
from social_core.backends.oauth import BaseOAuth2
from jose import JWTError
from consolemsg import error
from ..datasources import user_info
from .authentik.user_provision import UserProvision
from .common import JWT_ALGORITHM, auth_error, provisioning_apikey

# import os
# os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

def on_auth(auth, user):
    print("on_auth", auth, user)
    username = user.get("username", user.get("email"))
    if not username:
        auth_error(f"Expected token keys not found in: {user}")
    info = user_info(username)
    if not info:
        auth_error(f"Not such an user {username}")
    print("on auth returns", info)
    return info

def authentik_api_url():
    from dotenv import load_dotenv
    load_dotenv()
    return os.environ.get("AUTHENTIK_API_URL")

class AuthentikOauth2(BaseOAuth2):
    name = "authentik"
    AUTHENTIK_API_URL=authentik_api_url()
    AUTHORIZATION_URL = f"{AUTHENTIK_API_URL}/application/o/authorize/"
    ACCESS_TOKEN_URL = f"{AUTHENTIK_API_URL}/application/o/token/"
    ACCESS_TOKEN_METHOD = "POST"
    REVOKE_TOKEN_URL = f"{AUTHENTIK_API_URL}/application/o/revoke"
    REVOKE_TOKEN_METHOD = "GET"
    DEFAULT_SCOPE = ["test"]
    REDIRECT_STATE = False
    # EXTRA_DATA = [("expires_in", "expires"), ("refresh_token", "refresh_token")]


class OurClaims(Claims):

    def __init__(self, seq=None, **kwargs) -> None:
        super().__init__(seq or {}, **kwargs)
        self["display_name"] = kwargs.get("display_name", self.get("name", "nickname"))
        self["identity"] = kwargs.get(
            "identity", self.get("preferred_username", "username")
        )
        self["picture"] = kwargs.get("picture", self.get("picture", "picture"))
        self["email"] = kwargs.get("email", self.get("email", "email"))


def setup_auth(app):
    config = OAuth2Config(
        # Forbids http (not https) queries to access the cookie
        # TODO: Only false for development
        allow_http=True,
        # enable_ssr=False,
        jwt_secret=os.getenv("JWT_SECRET"),
        jwt_expires=os.getenv("JWT_EXPIRES", 300),
        jwt_algorithm=JWT_ALGORITHM, # Force
        clients=[
            OAuth2Client(
                backend=GoogleOAuth2,
                client_id=os.getenv("OAUTH2_GOOGLE_CLIENT_ID"),
                client_secret=os.getenv("OAUTH2_GOOGLE_CLIENT_SECRET"),
                scope=["openid", "profile", "email"],
                # TODO: This is required to work with proxy and not always work
                # redirect_uri='/',
                redirect_uri="http://localhost:5173/",
                claims=Claims(
                    identity=lambda user: f"{user.provider}:{user.sub}",
                ),
            ),
            OAuth2Client(
                backend=AuthentikOauth2,
                client_id=os.getenv("OAUTH2_AUTHENTIK_CLIENT_ID"),
                client_secret=os.getenv("OAUTH2_AUTHENTIK_CLIENT_SECRET"),
                # scope=["test", "openid", "profile", "email"],
                scope=["openid", "profile", "email"],
                # TODO: This is required to work with proxy and not always work
                # redirect_uri='/',
                redirect_uri="http://localhost:5173/",
                claims=Claims(
                    identity=lambda user: f"{user.provider}:{user.sub}",
                    email=lambda user: f"{user.email}",
                    display_name=lambda user: f"{user.display_name}",
                    # identity=lambda user: f"{user.email}",
                ),
            ),
        ],
    )
    @app.post('/api/auth/somenergia/provisioning')
    def somenergia_auth_provision_user(
        name: Annotated[str, Body()],
        username: Annotated[str, Body()], # TODO: Validate as vat
        password: Annotated[str, Body()],
        email: Annotated[EmailStr, Body()],
        key: str = Depends(provisioning_apikey)
    ):
        """Administrative password set for the Local Authentication"""
        UserProvision().provision_user(
            username=username,
            name=name,
            email=email,
            password=password,
	)
        return dict(
            result = 'ok',
        )

        

    app.include_router(oauth2_router)
    app.add_middleware(
        OAuth2Middleware,
        config=config,
        callback=on_auth,
    )
