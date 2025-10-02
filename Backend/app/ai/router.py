from fastapi import APIRouter
from app.core.config import get_settings
from app.ai.providers.gemini import GeminiProvider
from app.ai.providers.groq import GroqProvider
from app.ai.providers.groq import GroqProvider
from app.ai.providers.mistral_provider import MistralProvider

router = APIRouter(prefix="/ai", tags=["ai"])
settings = get_settings()


def provider_from_name(name: str | None):
    available = {}

    if settings.Mistral_API_KEY:
        available["mistral"] = MistralProvider(settings.Mistral_API_KEY)

    if settings.GROQ_API_KEY:
        available["groq"] = GroqProvider(settings.GROQ_API_KEY)

    if settings.GEMINI_API_KEY:
        available["gemini"] = GeminiProvider(settings.GEMINI_API_KEY)

    if name and name in available:
        return available[name]

    for k in ["gemini","mistral", "groq"]:
        if k in available:
            return available[k]

    return None






