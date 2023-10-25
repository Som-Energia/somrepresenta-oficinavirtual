from pathlib import Path
from typing import Annotated
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm, APIKeyHeader
from fastapi.responses import JSONResponse
from fastapi import Depends, Body
from jose import JWTError, jwt
from .auth import auth_error, validated_user, JWT_ALGORITHM
from consolemsg import error
import os
from yamlns import ns
from .models import TokenUser

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
    hashed_password = get_hashed_password(login)
    if not hashed_password:
        error("Inactive user")
        # TODO: Do not save the password!!
        #set_password(login, password)
        return False
    if not verify_password(password, hashed_password):
        error("Bad password")
        return False
    error("ok")
    return True

def dummy_user_info(login: str)->TokenUser:
    """
    This token emulates a erp query on user info for a given username/login.

    When username is a NIF, uses it to fill then email and fills a fake name.

    >>> def p(x): print(ns(x.model_dump()).dump())
    >>> p(dummy_user_info(login='12345678Z'))
    nif: 12345678Z
    name: Perico Palotes
    email: 12345678z@nowhere.com
    roles:
    - customer
    <BLANKLINE>

    When username is an email, extracts the first part as name, and fills a
    fake nif that depends on the email hash

    >>> p(dummy_user_info(login='ahmed.jimenez@noplace.com'))
    nif: 23435017Z
    name: Ahmed Jimenez
    email: ahmed.jimenez@noplace.com
    roles:
    - customer
    <BLANKLINE>

    When username is neither a NIF nor an email, considers it a erp username.
    builds an email out of it, a nif from the hash, and assigns 'staff' role.

    >>> p(dummy_user_info(login='Sira Ruiz'))
    nif: 75881875Z
    name: Sira Ruiz
    email: sira.ruiz@somenergia.coop
    roles:
    - staff
    <BLANKLINE>

    """

    nif = None
    roles=['customer']
    if '@' in login:
        email = login
        name = " ".join(
            token.title()
            for token in login
                .split('@')[0]
                .replace('.', ' ')
                .replace('_', ' ')
                .replace('-', ' ')
                .split()
        )
    else:
        email = '.'.join(
            login.replace('.,', ' ').split()
        ).lower()
        if login[1:5].isdigit():
            name = "Perico Palotes"
            nif = login
            email += '@nowhere.com'
        else:
            name = login
            email += '@somenergia.coop'

    if email.endswith('@somenergia.coop'):
        roles=['staff']
    import hashlib
    digest=hashlib.sha1(login.encode('utf8')).digest()
    nif = nif or (''.join(str(c)[-1] for c in digest)[-8:]+"Z")
    return TokenUser(
        nif = nif,
        name = name,
        email = email,
        roles = roles,
    )

user_info = dict(
    dummy = dummy_user_info,
)[os.environ.get("USER_INFO_BACKEND", "dummy")]


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
            # TODO: Use the erp
            user = user_info(form_data.username)
            if not user:
                raise auth_error("Incorrect username")

            auth_ok = authenticate_user(user.nif, form_data.password)
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
                secure=True, # TODO: just if https in request
                httponly=True,
            )
        except Exception as e:
            error(f"While autenticating: {type(e)} {e}")
            raise
        return response

    @app.get('/api/auth/change_password')
    def local_auth_change_password(current_password: str, new_password: str, user: TokenUser = Depends(validated_user)):
        "Change the password for the Local Authentication"
        auth_ok = authenticate_user(user.nif, current_password)
        if not auth_ok:
            raise auth_error("Incorrect password")
        set_password(user.nif, new_password)
        return dict(
            result = 'ok',
        )

    apikey_on_header = APIKeyHeader(name="x-api-key")
    def provisioning_apikey(key: str = Depends(apikey_on_header)):
        """Ensures that the query comes from ERP"""
        expected = os.environ.get('ERP_PROVISIONING_APIKEY')
        if not expected: raise auth_error("Disabled key")
        if key != expected: raise auth_error("Invalid key")


    @app.post('/api/auth/provisioning')
    def local_auth_admin_provisioning(
        username: Annotated[str, Body()],
        password: Annotated[str, Body()],
        key: str = Depends(provisioning_apikey)
    ):
        """Administrative password set for the Local Authentication"""
        set_password(username, password)
        return dict(
            result = 'ok',
        )



