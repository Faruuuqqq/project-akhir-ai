from fastapi import HTTPException

class FileProcessingError(HTTPException):
    def __init__(self, detail: str, status_code: int = 400):
        super().__init__(status_code=status_code, detail=detail)

def handle_file_validation_error(error: str) -> HTTPException:
    return HTTPException(status_code=400, detail=error)

def handle_inference_error(error: str) -> HTTPException:
    return HTTPException(status_code=500, detail=error)