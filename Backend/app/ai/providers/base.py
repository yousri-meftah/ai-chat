from abc import ABC, abstractmethod

class AIProvider(ABC):
    name: str

    @abstractmethod
    async def chat(self, messages: list[dict], lang: str) -> str: ...
