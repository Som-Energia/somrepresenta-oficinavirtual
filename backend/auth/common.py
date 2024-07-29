import os
from fastapi.security import APIKeyHeader
from fastapi import Depends, HTTPException, status
from fastapi_oauth2.security import OAuth2
from fastapi.security.utils import get_authorization_scheme_param
from jose import JWTError, jwt
from consolemsg import error
from fastapi.responses import JSONResponse

JWT_ALGORITHM = "HS256"

# Common Errors

def auth_error(message):
    error(message)
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=message,
        headers={"WWW-Authenticate": "Bearer"},
    )

def forbidden_error(message):
    error(message)
    return HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail=message,
        headers={"WWW-Authenticate": "Bearer"},
    )

# 

def authenticated_token_response(access_token):
    response = JSONResponse(dict(
            access_token= access_token,
            token_type= "bearer",
        ))
    expires_seconds = int(os.getenv("JWT_EXPIRES"))
    response.set_cookie(
            "Authorization",
            value=f"Bearer {access_token}",
            max_age=expires_seconds,
            expires=expires_seconds,
            secure=True, # TODO: just if https in request
            httponly=True,
        )
    return response

def create_access_token(data: dict):
    import datetime
    expires_seconds = int(os.getenv("JWT_EXPIRES"))
    expires_delta = datetime.timedelta(seconds=expires_seconds)
    expire = datetime.datetime.utcnow() + expires_delta
    encoded_jwt = jwt.encode(
        dict(data, exp=expire),
        os.getenv("JWT_SECRET"),
        algorithm=JWT_ALGORITHM,
    )
    return encoded_jwt

# Security Dependencies

oauth2 = OAuth2()

async def validated_user(authorization: str = Depends(oauth2)):
    schema, token = get_authorization_scheme_param(authorization)
    if not authorization or schema.lower() != "bearer":
        if not oauth2.auto_error:
            return None
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


async def validated_staff(user: dict = Depends(validated_user)):
    if "staff" not in user.get("roles", []):
        raise forbidden_error(f"{user['username']} is not staff")
    return user

apikey_on_header = APIKeyHeader(name="x-api-key")

def provisioning_apikey(key: str = Depends(apikey_on_header)):
    """Ensures that the query comes from ERP"""
    expected = os.environ.get('ERP_PROVISIONING_APIKEY')
    if not expected: raise auth_error("Disabled key")
    if key != expected: raise auth_error("Invalid key")

