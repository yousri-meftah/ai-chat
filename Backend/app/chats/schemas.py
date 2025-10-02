from pydantic import BaseModel
from app.db.models import Lang
from typing import List, Optional
from datetime import datetime


class CreateChatIn(BaseModel):
    title: str | None = None

class ChatOut(BaseModel):
    id: int
    title: str

class SendMessageIn(BaseModel):
    chat_id: int
    content: str
    model: str | None = None      
    lang: Lang | None = None     

class MessageOut(BaseModel):
    role: str
    content: str
    model: str | None = None
    lang: Lang

class ChatItem(BaseModel):
    id: int
    title: str
    created_at: datetime

    class Config:
        from_attributes = True  # allows ORM objects to be converted directly


class ChatListResponse(BaseModel):
    items: List[ChatItem]


class MessageItem(BaseModel):
    id: int
    role: str
    content: str
    model: Optional[str] = None
    lang: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChatDetailResponse(BaseModel):
    id: int
    title: str
    messages: List[MessageItem]


class DeleteChatResponse(BaseModel):
    message: str