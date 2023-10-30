import os
from fastapi import Depends, HTTPException, status
from fastapi_oauth2.middleware import OAuth2Middleware
from fastapi_oauth2.router import router as oauth2_router
from fastapi_oauth2.claims import Claims
from fastapi_oauth2.client import OAuth2Client
from fastapi_oauth2.config import OAuth2Config
from fastapi_oauth2.security import OAuth2
from fastapi.security.utils import get_authorization_scheme_param
from social_core.backends.google import GoogleOAuth2
from jose import JWTError, jwt
from consolemsg import error
from .datasources import user_info

JWT_ALGORITHM = 'HS256'

oauth2 = OAuth2()

def auth_error(message):
    error(message)
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=message,
        headers={"WWW-Authenticate": "Bearer"},
    )


async def validated_user(authorization: str = Depends(oauth2)):
    schema, token = get_authorization_scheme_param(authorization)
    if not authorization or schema.lower() != "bearer":
        if not oauth2.auto_error: return None
        raise auth_error("Not authenticated")
    try:
        payload = jwt.decode(
            token=token,
            key=os.getenv("JWT_SECRET"),
            algorithms=JWT_ALGORITHM,
        )
    except JWTError as e:
        raise auth_error(f"Token decoding failed: {e}")
    return payload

def on_auth(auth, user):
    print("on_auth", auth, user)
    info = user_info(user['email'])
    if not info:
        auth_error(f"Not such an user {user}")

def setup_auth(app):
    config = OAuth2Config(
        # Forbids http (not https) queries to access the cookie
        # TODO: Only false for development
        allow_http=False,
        #enable_ssr=False,
        jwt_secret=os.getenv("JWT_SECRET"),
        jwt_expires=os.getenv("JWT_EXPIRES"),
        jwt_algorithm=JWT_ALGORITHM, # Force
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
