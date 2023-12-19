import os
from .dummy import DummyBackend
from .erp import ErpBackend
from ..models import TokenUser, UserProfile, SignatureResult, InstallationSummary, InstallationDetailsResult, Invoice

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

def installation_list(username: str) -> list[InstallationSummary]:
    return backend().installation_list(username)

def installation_details(username: str, contract_number: str) -> InstallationDetailsResult:
    return backend().installation_details(username, contract_number)

def invoice_list( username: str) -> list[Invoice]:
    return backend().invoice_list(username)

def invoice_pdf(username: str, invoice_number: str):
    return backend().invoice_pdf(username, invoice_number)
