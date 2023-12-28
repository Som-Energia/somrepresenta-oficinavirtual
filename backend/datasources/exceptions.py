from pydantic import ValidationError
from yamlns import ns
from consolemsg import error

class ErpError(Exception):
    def __init__(self, erp_error: dict):
        formatted_trace = ''.join(erp_error.get('trace', "No trace available"))
        super().__init__((
            "{code}\n"
            "{error}\n\n"
            "Remote backtrace:\n {formatted_trace}"
        ).format(
            formatted_trace=formatted_trace,
            **erp_error,
        ))

class ErpValidationError(ErpError):
    def __init__(self, exception: ValidationError):
        message = (
            "Invalid data received from ERP\n"
            f"{ns(error=ns.loads(exception.json())).dump()}"
        )
        error(message)
        self.original = exception
        super().__init__(dict(
            code="ErpValidationError",
            error=message,
        ))

class ContractWithoutInstallation(ErpError):
    pass

class ContractNotExists(ErpError):
    pass

class UnauthorizedAccess(ErpError):
    pass

class NoSuchUser(ErpError):
    pass

class NoSuchInvoice(ErpError):
    pass

class NoDocumentVersions(ErpError):
    pass
