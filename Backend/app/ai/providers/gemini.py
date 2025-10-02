import google.generativeai as genai
from app.ai.providers.base import AIProvider
import anyio


class GeminiProvider(AIProvider):
    def __init__(self, api_key: str, model: str = "gemini-2.5-flash", name: str = "gemini"):
        self.model = model
        self.name = name
        genai.configure(api_key=api_key)

    async def chat(self, messages: list[dict], lang: str) -> str:
        return await anyio.to_thread.run_sync(self._chat_sync, messages)

    def _chat_sync(self, messages: list[dict]) -> str:
        prompt = "\n".join([f"{m['role']}: {m['content']}" for m in messages])
        model = genai.GenerativeModel(self.model)
        response = model.generate_content(prompt)
        return response.text
