import typer
import httpx
import os
import dotenv
import json
from typing import Optional

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
    apikey: Optional[str] = None,
):
    """
    Changes the password for a user.

    Requires ERP_PROVISIONING_APIKEY to be in the environment.
    """
    apikey = apikey or os.environ['ERP_PROVISIONING_APIKEY']
    r = httpx.post(
        url=apiurl+'/api/auth/provisioning',
        headers={
            'x-api-key': apikey,
        },
        json=dict(
            username=username,
            password=password,
        ),
    )
    r.raise_for_status()
    pretty(r.json())




if __name__ == "__main__":
    app()

