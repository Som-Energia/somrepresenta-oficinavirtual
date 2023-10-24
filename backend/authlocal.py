from yamlns import ns
from pathlib import Path
from typing import Annotated
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from fastapi import Depends
from jose import JWTError, jwt
from .auth import auth_error, validated_user, JWT_ALGORITHM
from consolemsg import error
import os

passwords_file = Path('passwords.yaml')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def load_passwords():
    if not passwords_file.exists():
        return ns()
    return ns.load(passwords_file)

def get_password_hash(password):
    return pwd_context.hash(password)

def set_password(user, password):
    users = load_passwords()
    users[user] = get_password_hash(password)
    users.dump(passwords_file)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def show_password(password):
    hashed = get_password_hash(password)
    error(f'the hashed password is {hashed}')
    

def authenticate_user(username: str, password: str):
    users = load_passwords()
    error(f"username {username}")
    if username not in users:
        error("Bad user")
        # TODO: Do not save the password!!
        set_password(username, password)
        return False
    hashed_password = users[username]
    if not verify_password(password, hashed_password):
        error("Bad password")
        # TODO: Remove this trace
        show_password(password)
        return False
    error("ok")
    # TODO: rethink what to return
    return ns(
        username=username,
        name=username.split('@')[0],
    )

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

    @app.post("/api/auth/logout", response_model=dict)
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
            user = authenticate_user(form_data.username, form_data.password)
            error(f"user {user.dump()}")
            if not user:
                raise auth_error("Incorrect username or password")
            access_token = create_access_token(
                data=dict(
                    user,
                    sub = user.username,
                ),
            )

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
            error(f"While autenticating: {e}")
            raise
        return response


