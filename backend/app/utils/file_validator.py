from app.config import settings

ALLOWED_EXTENSIONS = ['.dcm', '.png']

def validate_file(filename: str, file_size: int) -> None:
    """Validate file before processing."""
    if file_size > settings.MAX_FILE_SIZE:
        raise ValueError(f"File exceeds {settings.MAX_FILE_SIZE / (1024*1024):.0f}MB limit")
    
    extension = filename.lower()[filename.rfind('.'):]
    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError(f"File must be .dcm or .png format")