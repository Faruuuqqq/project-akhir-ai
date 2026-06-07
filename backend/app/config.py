import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    FASTAPI_ENV: str = os.getenv("FASTAPI_ENV", "development")
    MODEL_PATH: str = os.getenv("MODEL_PATH", "./models/model.safetensors")
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:3000")
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", "52428800"))  # 50MB
    INFERENCE_TIMEOUT: int = int(os.getenv("INFERENCE_TIMEOUT", "30"))
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    class Config:
        env_file = ".env"

settings = Settings()
