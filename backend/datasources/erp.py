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
    print('initial', result.dump())

    # TODO: What to do with false emails 
    if not result.email:
        result.email = result.nif.lower()+'@missingmail.com'
    print(result.dump())

    # TODO: Returning a list, not a dictionary, values can be false?
    result.roles = list(result.roles)
    print(result.dump())

    result.avatar = None
    print(result.dump())

    try:
        return TokenUser(**result)
    except Exception as e:
        print(dir(e))
        print(ns(error=ns.loads(e.json())).dump())

def erp_profile_info(user_info: dict) -> UserProfile:
    e = erp.Erp()
    retrieved = e.profile(user_info['username'])
    print(retrieved)
    try:
        return UserProfile(**retrieved)
    except Exception as e:
        print(e.json())

