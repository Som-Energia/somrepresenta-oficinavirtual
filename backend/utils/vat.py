def nif2vat(nif_or_vat):
    """
    >>> nif2vat('12345678Z')
    'ES12345678Z'
    >>> nif2vat('ES12345678Z')
    'ES12345678Z'
    >>> nif2vat('ATU99999999')
    'ATU99999999'
    """
    from stdnum.es import nif
    if nif_or_vat.startswith('ES'):
        return nif_or_vat
    if not nif.is_valid(nif_or_vat):
        return nif_or_vat
    return 'ES'+nif_or_vat

def vat2nif(nif_or_vat):
    """
    >>> vat2nif('ES12345678Z')
    '12345678Z'
    >>> vat2nif('12345678Z')
    '12345678Z'
    >>> nif2vat('ATU99999999') # Foreign vats are kept
    'ATU99999999'
    """
    if nif_or_vat.startswith('ES'):
        return nif_or_vat[2:]
    return nif_or_vat


