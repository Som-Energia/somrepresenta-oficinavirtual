import os
from fastapi.security import APIKeyHeader
from fastapi import Depends, HTTPException, status
from consolemsg import error

def auth_error(message):
    error(message)
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=message,
        headers={"WWW-Authenticate": "Bearer"},
    )

apikey_on_header = APIKeyHeader(name="x-api-key")
def provisioning_apikey(key: str = Depends(apikey_on_header)):
    """Ensures that the query comes from ERP"""
    expected = os.environ.get('ERP_PROVISIONING_APIKEY')
    if not expected: raise auth_error("Disabled key")
    if key != expected: raise auth_error("Invalid key")