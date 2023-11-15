import os
from .dummy import dummy_user_info, dummy_profile_info
from .erp import erp_user_info, erp_profile_info, erp_sign_document
from ..models import TokenUser, UserProfile, SignatureResult

# TODO: Use classes and polymorphism

def user_info(login: str) -> TokenUser:
    delegate_id = os.environ.get("DATA_BACKEND", "dummy")
    delegates = dict(
        dummy = dummy_user_info,
        erp = erp_user_info,
    )
    delegate = delegates.get(delegate_id, dummy_user_info)
    return delegate(login)

def profile_info(user_info: dict) -> UserProfile:
    delegate_id = os.environ.get("DATA_BACKEND", "dummy")
    delegates = dict(
        dummy = dummy_profile_info,
        erp = erp_profile_info,
    )
    delegate = delegates.get(delegate_id, dummy_profile_info)
    return delegate(user_info)


def sign_document(username: str, document: str) -> SignatureResult:
    return erp_sign_document(username, document)
