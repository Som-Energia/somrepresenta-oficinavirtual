import urllib.parse
import hashlib
 
def gravatar(email, size=128, default='404'):
    utf8email = email.lower().encode('utf8')
    emailhash = hashlib.md5(utf8email).hexdigest()
    return (
        f"https://www.gravatar.com/avatar/{emailhash}?"+
        urllib.parse.urlencode(dict(
            d=default,
            s=str(size),
        ))
    )
