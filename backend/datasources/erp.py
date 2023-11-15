from yamlns import ns
from consolemsg import error, success
from ..models import TokenUser, UserProfile, SignatureResult
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
    # TODO: Some nifs have not ES
    # TODO: Some data has trailing \n
    # TODO: nif2vat deal with emails
    result = ns(e.identify(nif2vat(login)))
    if 'error' in result:
        error(result.dump())
        return None

    result.avatar = None

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
