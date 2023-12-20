import io
from fastapi.responses import StreamingResponse

class PdfStreamingResponse(StreamingResponse):
    media_type='application/pdf'

    def __init__(self, binary_data: bytes, filename: str, **kwds):
        def binary_stream(binary_data):
            import io
            with io.BytesIO(binary_data) as f:
                yield from f

        super().__init__(
            binary_stream(binary_data),
            headers = {
                'Content-Disposition': f'attachment; filename="{filename}"',
            },
            **kwds)

