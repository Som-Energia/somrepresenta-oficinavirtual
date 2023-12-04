import os
from contextlib import contextmanager

@contextmanager
def environ(var, value):
    """
    Context handler to modify environment variables
    while inside the context and restore them on exit.
    Use None as value to unset.

    >>> import os
    >>> os.environ['DEFINED_VAR'] = "Previous value"
    
    Restores old values of defined variables
    >>> with environ('DEFINED_VAR', 'New value'):
    ...    os.environ.get('DEFINED_VAR')
    'New value'
    >>> os.environ.get('DEFINED_VAR')
    'Previous value'

    Clears variable if set to None
    >>> with environ('DEFINED_VAR', None):
    ...    'DEFINED_VAR' in os.environ
    False
    >>> 'DEFINED_VAR' in os.environ
    True

    Restores indefinition on undefined variables
    >>> with environ('UNDEFINED_VAR', 'value'):
    ...    os.environ.get('UNDEFINED_VAR')
    'value'
    >>> os.environ.get('UNDEFINED_VAR') # Nothing

    Behave on exception
    >>> try:
    ...     with environ('DEFINED_VAR', 'New'):
    ...         raise Exception("Error")
    ... except: pass
    >>> os.environ.get('DEFINED_VAR')
    'Previous value'
    """
    def set(value):
        if value is not None:
            os.environ[var]=value
        elif var in os.environ:
            del os.environ[var]
    
    oldvalue = os.environ.get(var)
    set(value)
    try:
        yield value
    finally:
        set(oldvalue)
