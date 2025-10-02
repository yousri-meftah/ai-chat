from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()  

class Settings(BaseModel):
    APP_NAME: str = os.getenv("APP_NAME", "AI Chat Backend")
    APP_ENV: str = os.getenv("APP_ENV", "dev")
    BACKEND_CORS_ORIGINS: list[str] = os.getenv("BACKEND_CORS_ORIGINS","").split(",") if os.getenv("BACKEND_CORS_ORIGINS") else ["*"]

    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")

    JWT_SECRET: str = os.getenv("JWT_SECRET", "change_me")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM","HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES","120"))

    DEFAULT_LANG: str = os.getenv("DEFAULT_LANG","en")

    GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY") or None
    Mistral_API_KEY: str | None = os.getenv("Mistral_API_KEY") or None
    GROQ_API_KEY: str | None = os.getenv("GROQ_API_KEY") or None


def get_settings() -> Settings:
    return Settings()