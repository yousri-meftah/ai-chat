from groq import Groq
from app.ai.providers.base import AIProvider

class GroqProvider(AIProvider):
    def __init__(self, api_key: str, model: str = "llama-3.1-8b-instant", name: str = "groq"):
        self.client = Groq(api_key=api_key)
        self.model = model
        self.name = name

    async def chat(self, messages: list[dict], lang: str) -> str:
        import anyio
        return await anyio.to_thread.run_sync(self._chat_sync, messages, lang)

    def _chat_sync(self, messages: list[dict], lang: str) -> str:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            max_tokens=512,
            temperature=0.7
        )
        return response.choices[0].message.content
