from sqlalchemy import String, Integer, ForeignKey, Text, DateTime, Enum, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
import enum
from datetime import datetime

# we should always saperate the models, but for simplicity we keep them here

class Lang(str, enum.Enum):
    en="en"
    ar="ar"
    
class Role(str, enum.Enum):
    user="user"
    assistant="assistant"
    system="system"
    
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str]
    preferred_lang: Mapped[Lang]
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    chats: Mapped[list["Chat"]] = relationship("Chat", back_populates="user", cascade="all,delete-orphan")
    summaries: Mapped[list["UserSummary"]] = relationship("UserSummary", back_populates="user", cascade="all,delete-orphan")


class Chat(Base):
    __tablename__ = "chats"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    title: Mapped[str] = mapped_column(String(255), default="New Chat")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped["User"] = relationship("User", back_populates="chats")
    messages: Mapped[list["Message"]] = relationship("Message", back_populates="chat", cascade="all,delete-orphan")

    summary: Mapped["ChatSummary"] = relationship("ChatSummary", back_populates="chat", uselist=False, cascade="all,delete-orphan")



class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    chat_id: Mapped[int] = mapped_column(ForeignKey("chats.id"))
    role: Mapped[Role]
    content: Mapped[str] = mapped_column(Text)
    model: Mapped[str | None] = mapped_column(String(64))
    lang: Mapped[Lang]
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    chat: Mapped["Chat"] = relationship("Chat", back_populates="messages")


class UserSummary(Base):
    __tablename__ = "user_summaries"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    lang: Mapped[Lang]
    summary: Mapped[str] = mapped_column(Text)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    user: Mapped["User"] = relationship("User", back_populates="summaries")

class ChatSummary(Base):
    __tablename__ = "chat_summaries"

    id: Mapped[int] = mapped_column(primary_key=True)
    chat_id: Mapped[int] = mapped_column(ForeignKey("chats.id"))
    lang: Mapped[Lang]
    summary: Mapped[str] = mapped_column(Text)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    chat: Mapped["Chat"] = relationship("Chat", back_populates="summary")

