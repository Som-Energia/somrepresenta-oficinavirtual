from yamlns import ns
from consolemsg import error, success
from ..models import TokenUser, UserProfile
from .. import erp
from ..utils.gravatar import gravatar
from ..utils.vat import nif2vat

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
    except Exception as error:
        print(ns(error=ns.loads(error.json())).dump())
        raise

def erp_profile_info(user_info: dict) -> UserProfile:
    e = erp.Erp()
    retrieved = e.profile(user_info['username'])
    try:
        return UserProfile(**retrieved)
    except Exception as error:
        print(ns(error=ns.loads(error.json())).dump())
        raise

