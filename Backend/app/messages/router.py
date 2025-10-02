from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from langdetect import detect
from app.deps import get_db, get_current_user
from app.db.models import Chat, Message, Role, Lang, UserSummary
from app.ai.summarizer import update_chat_summary,summarize_history
from app.ai.router import provider_from_name
from app.core.i18n import t

from .schemas import (
    SendMessageRequest,
    SendMessageResponse,
    UserMessageResponse,
    AssistantMessageResponse,
)

router = APIRouter(prefix="/messages", tags=["messages"])

@router.post("/send", response_model=SendMessageResponse)
async def send_message(
    payload: SendMessageRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    chat_id = payload.chat_id
    content = payload.content.strip()
    model_name = payload.model

    if not content:
        raise HTTPException(400, detail="content is required")


    prov = provider_from_name(model_name)
    if not prov:
        raise HTTPException(503, detail="AI provider/model not available")
    # i dont know if i should detect the lang or use user preferred lang , i will do this for now
    try:
        detected = detect(content)
        lang = Lang(detected) if detected in ["en", "ar"] else user.preferred_lang
    except Exception:
        lang = user.preferred_lang


    if not chat_id:
        title = " ".join(content.split()[:6]) + ("..." if len(content.split()) > 6 else "")
        chat = Chat(user_id=user.id, title=title or "New Chat")
        db.add(chat)
        db.flush()
        chat_id = chat.id
    else:
        chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == user.id).first()
        if not chat:
            raise HTTPException(404, detail="Chat not found")


    user_msg = Message(chat_id=chat.id, role=Role.user, content=content, model=None, lang=lang)
    db.add(user_msg)
    db.flush()

    if chat.summary:
        messages = [
            {"role": "system", "content": "Answer in Arabic" if lang == Lang.ar else "Answer in English"},
            {"role": "assistant", "content": chat.summary.summary},
            {"role": "user", "content": content},
        ]
    else:
        history = (
            db.query(Message)
            .filter(Message.chat_id == chat.id)
            .order_by(Message.id.asc())
            .all()
        )
        messages = [{"role": m.role.value, "content": m.content} for m in history]
        messages.insert(
            0,
            {"role": "system", "content": "Answer in Arabic" if lang == Lang.ar else "Answer in English"},
        )

    reply = await prov.chat(messages, lang=lang.value)

    assistant_msg = Message(chat_id=chat.id, role=Role.assistant, content=reply, model=prov.name, lang=lang)
    db.add(assistant_msg)
    db.flush()


    summary_text = await update_chat_summary(
        prov=prov,
        chat=chat,
        db=db,
        lang=lang.value,
        user_msg=content,
        assistant_msg=reply,
    )

    db.commit()
    
    # this is too much to return , maybe we can return less data later otherwise frontend will handle it
    return SendMessageResponse(
        chat_id=chat.id,
        chat_title=chat.title,
        user_message=UserMessageResponse(
            id=user_msg.id,
            role=user_msg.role.value,
            content=user_msg.content,
            lang=user_msg.lang.value,
        ),
        assistant_message=AssistantMessageResponse(
            id=assistant_msg.id,
            role=assistant_msg.role.value,
            content=assistant_msg.content,
            model=assistant_msg.model,
            lang=assistant_msg.lang.value,
        ),
        chat_summary=summary_text,
    )

