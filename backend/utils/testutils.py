import os
from contextlib import contextmanager

@contextmanager
def environ(var, value):
    def set(value):
        if value:
            os.environ[var]=value
        else:
            del os.environ[var]
    
    oldvalue = os.environ.get(var)
    set(value)
    os.environ[var]=value
    try:
        yield
    finally:
        set(oldvalue)
