import typer
import httpx
import os
import dotenv
import json
from typing import Optional
from backend.erp import Erp

dotenv.load_dotenv()

app = typer.Typer(
    help="Manage the Representa OV",
)

apiurl = os.environ.get('APIURL', 'http://localhost:5137')

def pretty(data):
    formatted = json.dumps(data, sort_keys=True, indent=4)

    from pygments import highlight, lexers, formatters
    colored = highlight(
        formatted,
        lexers.JsonLexer(),
        formatters.TerminalFormatter(),
    )
    print(colored)

@app.command()
def server_version():
    """
    Returns the version of the server
    """
    r = httpx.get(
        url=apiurl+'/api/version',
    )
    r.raise_for_status()
    pretty(r.json())

@app.command()
def reset_password(
    username: str,
    password: str,
    name: str="Sense nom",
    email: str="noname@nowhere.org",
    remote: bool=False,
    apikey: Optional[str] = None,
):
    """
    Changes the password for a user.

    Requires ERP_PROVISIONING_APIKEY to be in the environment.
    """
    apikey = apikey or os.environ['ERP_PROVISIONING_APIKEY']
    remote_part = 'somenergia/' if remote else ''
    r = httpx.post(
        url=apiurl+f'/api/auth/{remote_part}provisioning',
        headers={
            'x-api-key': apikey,
        },
        json=dict(
            username=username,
            password=password,
            name=name,
            email=email,
        ),
    )
    r.raise_for_status()
    pretty(r.json())


@app.command()
def list_signatures(
    username: str,
    document: Optional[str] = None,
):
    """
    Clears any signature for the user and optional document
    """
    e = Erp()
    pretty(e.list_signatures(username, document))


@app.command()
def clear_signatures(
    username: str,
    document: Optional[str] = None,
):
    """
    Clears any signature for the user and optional document
    """
    e = Erp()
    pretty(e.clear_signatures(username, document))




if __name__ == "__main__":
    app()

