from ..models import TokenUser, UserProfile
from ..utils.gravatar import gravatar
from yamlns import ns
default_gravatar = 'identicon' # https://docs.gravatar.com/general/images/

def dni_from_seed(seed):
    """Returns a valid but random nif depending on seed string"""
    import hashlib
    digest=hashlib.sha1(seed.encode('utf8')).digest()
    dnistr = ''.join(str(c)[-1] for c in digest)[-8:]
    dniint = int(dnistr)
    checkdigit = "TRWAGMYFPDXBNJZSQVHLCKE"[dniint%23]
    return 'ES'+dnistr+checkdigit

def dummy_user_info(login: str)->TokenUser:
    """
    This token emulates a erp query on user info for a given username/login.

    When username is a NIF, uses its VAT version to fill then email and fills a fake name.

    >>> def p(x): print(ns(x.model_dump()).dump())
    >>> p(dummy_user_info(login='12345678Z'))
    username: ES12345678Z
    vat: ES12345678Z
    name: Perico Palotes
    email: 12345678z@nowhere.com
    roles:
    - customer
    avatar: https://www.gravatar.com/avatar/3c21fd9dfd53a55fc2dccd9927223026?d=identicon&s=128
    <BLANKLINE>

    When username is an email, extracts the first part as name, and fills a
    fake vat that depends on the email hash

    >>> def p(x): print(ns(x.model_dump()).dump())
    >>> p(dummy_user_info(login='12345678Z'))
    username: ES12345678Z
    vat: ES12345678Z
    name: Perico Palotes
    email: 12345678z@nowhere.com
    roles:
    - customer
    avatar: https://www.gravatar.com/avatar/3c21fd9dfd53a55fc2dccd9927223026?d=identicon&s=128
    <BLANKLINE>

    When username is an email, extracts the first part as name, and fills a
    fake vat that depends on the email hash

    >>> p(dummy_user_info(login='ahmed.jimenez@noplace.com'))
    username: ahmed.jimenez@noplace.com
    vat: ES23435017H
    name: Ahmed Jimenez
    email: ahmed.jimenez@noplace.com
    roles:
    - customer
    avatar: https://www.gravatar.com/avatar/b33b174df857c3739090351199b1df78?d=identicon&s=128
    <BLANKLINE>

    When username is neither a NIF nor an email, considers it a erp username.
    builds an email out of it, a vat from the hash, and assigns 'staff' role.

    >>> p(dummy_user_info(login='Sira Ruiz'))
    username: ES75881875E
    vat: ES75881875E
    name: Sira Ruiz
    email: sira.ruiz@somenergia.coop
    roles:
    - staff
    avatar: https://www.gravatar.com/avatar/83d1453396767bac8bf5fb110e68c142?d=identicon&s=128
    <BLANKLINE>

    """

    vat = None
    username = None
    roles=['customer']
    if '@' in login:
        email = login
        name = " ".join(
            token.title()
            for token in login
                .split('@')[0]
                .replace('.', ' ')
                .replace('_', ' ')
                .replace('-', ' ')
                .split()
        )
        username = email
    else:
        email = '.'.join(
            login.replace('.,', ' ').split()
        ).lower()
        if login[3:6].isdigit():
            vatprefix = ''
            if not login.startswith('ES'):
                vatprefix = 'ES'
            name = "Perico Palotes"
            vat = vatprefix + login
            email += '@nowhere.com'
            username = vat
        else:
            name = login
            email += '@somenergia.coop'

    if email.endswith('@somenergia.coop'):
        roles=['staff']
    vat = vat or dni_from_seed(login)
    username = username or vat
    avatar = gravatar(email, default=default_gravatar)
    return TokenUser(
        username = username,
        vat = vat,
        name = name,
        email = email,
        roles = roles,
        picture = avatar,
        avatar = avatar,
    )

def dummy_profile_info(user_info: dict) -> UserProfile:
    # TODO: Either query ERP or have a rich jwt and take data from it
    default = dict(
        avatar = user_info.get('avatar', user_info.get('picture', None)),
        username = 'ES12345678X',
        vat = 'ES12345678X',
        address = 'Rue del Percebe, 13',
        city = 'Salt',
        zip = '17234',
        state = 'Girona',
        phones = ['555444333'],
        proxy_name = 'Matute Gonzalez, Frasco',
        proxy_vat = '987654321X',
        roles = ['customer'],
    )
    return UserProfile(**dict(default, **user_info))

