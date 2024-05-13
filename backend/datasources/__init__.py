"""
Delegatable data source

Functions in this module abstract different data sources that can be
configured by using DATA_BACKEND environment.

Specific implementation are chosen by the backend() function
and are implemented in a module in this package.

Backend objects are guaranteed to be created and destroyed for each function call (no state kept).
"""

import os
from .dummy import DummyBackend
from .erp import ErpBackend
from ..models import (
    TokenUser,
    UserProfile,
    SignatureResult,
    InstallationSummary,
    InstallationDetailsResult,
    Invoice,
    InvoicePdf,
    InvoicesZip,
    CustomerProductionData,
)
from typing import Optional
from pydantic import AwareDatetime

def backend():
    # Is important not to cache the result it so that
    # tests can change the environment.
    delegate_id = os.environ.get("DATA_BACKEND", "dummy")
    delegates = dict(
        dummy=DummyBackend,
        erp=ErpBackend,
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


def installation_details(
    username: str, contract_number: str
) -> InstallationDetailsResult:
    return backend().installation_details(username, contract_number)


def invoice_list(username: str) -> list[Invoice]:
    return backend().invoice_list(username)


def invoice_pdf(username: str, invoice_number: str) -> InvoicePdf:
    return backend().invoice_pdf(username, invoice_number)


def invoices_zip(username: str, invoice_numbers: list[str]) -> InvoicesZip:
    return backend().invoices_zip(username, invoice_numbers)


def production_data(
    username: str,
    first_timestamp_utc: AwareDatetime,
    last_timestamp_utc: AwareDatetime,
    contract_number: Optional[str] = None
) -> CustomerProductionData:
    return backend().production_data(
        username,
        first_timestamp_utc,
        last_timestamp_utc,
        contract_number
    )

