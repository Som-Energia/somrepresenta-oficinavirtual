from ..models import TokenUser, UserProfile
from .. import erp
from ..utils.gravatar import gravatar
from yamlns import ns
from consolemsg import error, success
default_gravatar = 'identicon' # https://docs.gravatar.com/general/images/

def erp_user_info(login: str):
    e = erp.Erp()
    # TODO: Some nifs have not ES
    # TODO: Some data has trailing \n
    result = ns(e.partner('ES'+login))
    if 'error' in result:
        error(result.dump())
        return None
    print('initial', result.dump())

    # TODO: NIF is not VAT
    if result.nif[:2] == 'ES':
        result.nif = str(result.nif[2:])
    print(result.dump())

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
    # TODO: call erp.
    return dummy_profile_info(user_info)

    e = Erp()
    return UserProfile(**erp.profile('ES'+user_info['nif']))

