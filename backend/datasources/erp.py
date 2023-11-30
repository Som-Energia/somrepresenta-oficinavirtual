from yamlns import ns
from consolemsg import error, success
from ..models import TokenUser, UserProfile, SignatureResult, InstallationSummary
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

def erp_user_info(login: str):
    e = erp.Erp()
    # TODO: Handle emails as login
    result = ns(e.identify(nif2vat(login)))
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
    try:
        return UserProfile(**retrieved)
    except Exception as exception:
        print(ns(error=ns.loads(exception.json())).dump())
        raise

def erp_sign_document(username: str, document: str) -> SignatureResult:
    e = erp.Erp()
    retrieved = e.sign_document(username, document)
    if 'error' in retrieved:
        raise ErpError(retrieved)
    try:
        return SignatureResult(**retrieved)
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
        e = erp.Erp()
        installations = e.list_installations(username)
        return [
            InstallationSummary(**installation)
            for installation in installations
        ]

