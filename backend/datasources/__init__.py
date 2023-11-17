import os
from .dummy import DummyBackend
from .erp import ErpBackend
from ..models import TokenUser, UserProfile, SignatureResult

def backend():
    # Is important not to cache the result it so that
    # tests can change the environment.
    delegate_id = os.environ.get("DATA_BACKEND", "dummy")
    delegates = dict(
        dummy = DummyBackend,
        erp = ErpBackend,
    )
    delegate = delegates.get(delegate_id, DummyBackend)
    return delegate()

def user_info(login: str) -> TokenUser:
    return backend().user_info(login)

def profile_info(user_info: dict) -> UserProfile:
    return backend().profile_info(user_info)

def sign_document(username: str, document: str) -> SignatureResult:
    return backend().sign_document(username, document)

