from mistralai import Mistral
from app.ai.providers.base import AIProvider
import anyio


class MistralProvider(AIProvider):
    def __init__(self, api_key: str, model: str = "mistral-small-latest", name: str = "mistral"):
        self.client = Mistral(api_key=api_key)
        self.model = model
        self.name = name

    async def chat(self, messages: list[dict], lang: str) -> str:
        return await anyio.to_thread.run_sync(self._chat_sync, messages)

    def _chat_sync(self, messages: list[dict]) -> str:
        response = self.client.chat.complete(
            model=self.model,
            messages=messages,
            temperature=0.7,
            max_tokens=512,
        )
        return response.choices[0].message.content