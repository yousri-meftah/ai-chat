from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.deps import get_db, get_current_user
from app.db.models import Chat, Message, UserSummary, Lang
from app.chats.schemas import ChatListResponse,ChatDetailResponse,DeleteChatResponse,ChatItem,MessageItem

router = APIRouter(prefix="/chats", tags=["chats"])
# we dont need this endpoint for now

# @router.post("", response_model=dict)
# def create_chat(data: CreateChatIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
#     chat = Chat(user_id=user.id, title=data.title or "New Chat")
#     db.add(chat); db.commit(); db.refresh(chat)
#     return {"id": chat.id, "title": chat.title}

@router.get("", response_model=ChatListResponse)
def list_chats(db: Session = Depends(get_db), user=Depends(get_current_user)):
    chats = (
        db.query(Chat)
        .filter(Chat.user_id == user.id)
        .order_by(Chat.created_at.desc())
        .all()
    )
    return ChatListResponse(items=[ChatItem.model_validate(c) for c in chats])


@router.get("/{chat_id}", response_model=ChatDetailResponse)
def get_chat(chat_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == user.id).first()
    if not chat:
        raise HTTPException(404, "Chat not found")

    msgs = (
        db.query(Message)
        .filter(Message.chat_id == chat.id)
        .order_by(Message.id.asc())
        .all()
    )

    return ChatDetailResponse(
        id=chat.id,
        title=chat.title,
        messages=[
            MessageItem(
                id=m.id,
                role=m.role.value,
                content=m.content,
                model=m.model,
                lang=m.lang.value,
                created_at=m.created_at,
            )
            for m in msgs
        ],
    )


@router.delete("/{chat_id}", response_model=DeleteChatResponse)
def delete_chat(chat_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == user.id).first()
    if not chat:
        raise HTTPException(404, detail="Chat not found")

    db.delete(chat)
    db.commit()
    return DeleteChatResponse(message=f"Chat {chat_id} deleted successfully")