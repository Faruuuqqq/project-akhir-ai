from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    FASTAPI_ENV: str = "development"
    # Will look for safetensors first, if not found can be overridden via .env
    MODEL_PATH: str = "./models/model.safetensors"
    CORS_ORIGINS: str = "http://localhost:3000"
    MAX_FILE_SIZE: int = 52428800  # 50MB
    INFERENCE_TIMEOUT: int = 30
    LOG_LEVEL: str = "INFO"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

settings = Settings()
