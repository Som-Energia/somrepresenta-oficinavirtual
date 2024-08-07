from pathlib import Path
from typing import Annotated
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from fastapi import Depends, Body, Form
from pydantic import EmailStr
from jose import JWTError, jwt
from consolemsg import error, success
import os
from yamlns import ns
from .authremote import validated_user, validated_staff, JWT_ALGORITHM
from .auth.common import auth_error, provisioning_apikey
from .models import TokenUser
from .datasources import user_info

passwords_file = Path('passwords.yaml')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def load_passwords():
    if not passwords_file.exists():
        return ns()
    return ns.load(passwords_file)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_hashed_password(username):
    users = load_passwords()
    return users.get(username, None)

def set_password(username, password):
    users = load_passwords()
    users[username] = get_password_hash(password)
    users.dump(passwords_file)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(login: str, password: str) -> bool:
    """Validates user and password"""
    hashed_password = get_hashed_password(login)
    if not hashed_password:
        error(f"No password for {login}")
        return False
    if not verify_password(password, hashed_password):
        error(f"Bad password for user {login}")
        return False
    success(f"Correct password validation for {login} ok")
    return True

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

def setup_authlocal(app):
    'Setups the local auth in the application'

    @app.get("/api/auth/logout", response_model=dict)
    async def logout():
        response = JSONResponse(dict(
            result='ok',
        ))
        response.delete_cookie(key="Authorization")
        return response

    @app.post("/api/auth/token", response_model=dict)
    async def login_for_access_token(
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
    ):
        try:
            user = user_info(form_data.username)
            if not user:
                raise auth_error("Incorrect username")

            auth_ok = authenticate_user(user.username, form_data.password)
            if not auth_ok:
                raise auth_error("Incorrect password")
            access_token = create_access_token(user.data())

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
                #secure=True, # TODO: just if https in request
                httponly=True,
            )
        except Exception as e:
            error(f"While autenticating: {type(e)} {e}")
            raise
        return response

    @app.post("/api/auth/hijack", response_model=dict)
    async def login_hijack(
        username: str = Form(),
        staff_user: dict = Depends(validated_staff)
    ):
        try:
            hijacked = user_info(username)
            if not hijacked:
                raise auth_error("Incorrect username")

            if 'staff' in hijacked.roles:
                raise forbidden_error(f"Staff {hijacked.username} is not hijackable")

            access_token = create_access_token(hijacked.data())

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
        except Exception as e:
            error(f"While autenticating: {type(e)} {e}")
            raise
        return response

    @app.post('/api/auth/change_password')
    def local_auth_change_password(
        current_password: Annotated[str, Body()],
        new_password: Annotated[str, Body()],
        user: dict = Depends(validated_user),
    ):
        user = TokenUser(**user)
        "Change the password for the Local Authentication"
        auth_ok = authenticate_user(user.username, current_password)
        if not auth_ok:
            raise auth_error("Tio que no")
        set_password(user.username, new_password)
        return dict(
            result = 'ok',
        )

    @app.post('/api/auth/provisioning')
    def local_auth_provision_user(
        username: Annotated[str, Body()], # TODO: Validate as vat
        password: Annotated[str, Body()],
        name: Annotated[str|None, Body()]=None, # TODO: Remove conditional when erp adapted
        email: Annotated[EmailStr|None, Body()]=None, # TODO: Remove conditional when erp adapted
        key: str = Depends(provisioning_apikey)
    ):
        """Administrative password set for the Local Authentication"""
        set_password(username, password)
        return dict(
            result = 'ok',
        )



