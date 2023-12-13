from yamlns import ns
from consolemsg import error, success
from ..models import TokenUser, UserProfile, SignatureResult, InstallationSummary, InstallationDetailsResult
from .. import erp
from ..utils.gravatar import gravatar
from ..utils.vat import nif2vat

class ErpError(Exception):
    def __init__(self, erp_error: dict):
        formatted_trace = ''.join(erp_error['trace'])
        super().__init__((
            "{code}\n"
            "{error}\n\n"
            "Remote backtrace:\n {formatted_trace}"
        ).format(
            formatted_trace=formatted_trace,
            **erp_error,
        ))

class ContractWithoutInstallation(ErpError):
    pass

class ContractNotExists(ErpError):
    pass

class UnauthorizedAccess(ErpError):
    pass

def processErpErrors(erp_response):
    if not 'error' in erp_response: return
    match erp_response:
        case {'code': 'ContractNotExists', **rest}:
            raise ContractNotExists(erp_response)
        case {'code': 'UnauthorizedAccess', **rest}:
            raise UnauthorizedAccess(erp_response)
        case {'code': 'ContractWithoutInstallation', **rest}:
            raise ContractWithoutInstallation(erp_response)

    raise ErpError(erp_response)

def erp_user_info(login: str):
    e = erp.Erp()
    # TODO: Handle emails as login
    result = ns(e.identify(nif2vat(login)))
    # TODO: processErpErrors(retrieved)
    if 'error' in result:
        error(result.dump())
        return None

    result.avatar = gravatar(result.email)

    try:
        return TokenUser(**result)
    except Exception as exception:
        print(ns(error=ns.loads(exception.json())).dump())
        raise

def erp_profile_info(user_info: dict) -> UserProfile:
    e = erp.Erp()
    retrieved = e.profile(user_info['username'])
    # TODO: processErpErrors(retrieved)
    try:
        return UserProfile(**retrieved)
    except Exception as exception:
        print(ns(error=ns.loads(exception.json())).dump())
        raise

def erp_sign_document(username: str, document: str) -> SignatureResult:
    e = erp.Erp()
    retrieved = e.sign_document(username, document)
    processErpErrors(retrieved)
    try:
        return SignatureResult(**retrieved)
    except Exception as exception:
        print(ns(error=ns.loads(exception.json())).dump())
        raise

def erp_installation_list(username: str) -> list[InstallationSummary]:
    e = erp.Erp()
    installations = e.list_installations(username)
    processErpErrors(installations)
    return [
        InstallationSummary(**installation)
        for installation in installations
    ]

def erp_installation_details(username: str, contract_number: str) -> InstallationDetailsResult:
    e = erp.Erp()
    retrieved = e.installation_details(username, contract_number)
    processErpErrors(retrieved)
    try:
        return InstallationDetailsResult(**retrieved)
    except Exception as exception:
        print(ns(error=ns.loads(exception.json())).dump())
        raise


class ErpBackend():
    def user_info(self, login: str) -> TokenUser | None:
        return erp_user_info(login)

    def profile_info(self, user_info: dict) -> UserProfile:
        return erp_profile_info(user_info)

    def sign_document(self, username: str, document: str) -> SignatureResult:
        return erp_sign_document(username, document)

    def installation_list(self, username: str) -> list[InstallationSummary]:
        return erp_installation_list(username)

    def installation_details(self, username: str, contract_number: str) -> InstallationDetailsResult:
        return erp_installation_details(username, contract_number)
