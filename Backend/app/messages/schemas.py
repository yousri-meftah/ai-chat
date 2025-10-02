from pydantic import BaseModel
from typing import Optional


class SendMessageRequest(BaseModel):
    chat_id: Optional[int] = None
    content: str
    model: str

class UserMessageResponse(BaseModel):
    id: int
    role: str
    content: str
    lang: str


class AssistantMessageResponse(BaseModel):
    id: int
    role: str
    content: str
    model: str
    lang: str


class SendMessageResponse(BaseModel):
    chat_id: int
    chat_title: str
    user_message: UserMessageResponse
    assistant_message: AssistantMessageResponse
    chat_summary: str
