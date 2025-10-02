from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.auth.schemas import SignupIn, LoginIn, TokenOut
from app.db.models import User
from app.core.security import hash_password, verify_password, create_access_token
from app.core.i18n import t
from app.ai.summarizer import refresh_user_summary
from fastapi import Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.deps import get_db, get_current_user
from app.db.models import Chat, Message
from app.ai.router import provider_from_name
from app.deps import get_db
from .schemas import ProfileResponse, UserProfile, UserStats
router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenOut)
def signup(data: SignupIn, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email==data.email).first():
        raise HTTPException(409, detail=t("auth.email_taken", lang=data.preferred_lang))
    user = User(email=data.email, hashed_password=hash_password(data.password), preferred_lang=data.preferred_lang)
    db.add(user); db.commit()
    token = create_access_token(sub=user.email)
    return TokenOut(access_token=token)

@router.post("/login", response_model=TokenOut)
def login(data: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email==data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(401, detail=t("auth.invalid_credentials", lang=getattr(user,"preferred_lang","en")))
    token = create_access_token(sub=user.email)
    return TokenOut(access_token=token)

@router.post("/logout")
def logout():
    # we should blacklist the token , i will do it later .
    return {"message": t("auth.logged_out")}



@router.get("/profile", response_model=ProfileResponse)
async def get_profile(db: Session = Depends(get_db), user=Depends(get_current_user)):
    total_chats = db.query(func.count(Chat.id)).filter(Chat.user_id == user.id).scalar()
    total_messages = (
        db.query(func.count(Message.id))
        .join(Chat)
        .filter(Chat.user_id == user.id)
        .scalar()
    )
    fav_model = (
        db.query(Message.model, func.count(Message.id))
        .join(Chat)
        .filter(Chat.user_id == user.id, Message.role == "assistant", Message.model != None)
        .group_by(Message.model)
        .order_by(func.count(Message.id).desc())
        .first()
    )
    favorite_model = fav_model[0] if fav_model else "gemini"

    prov = provider_from_name("gemini")
    global_summary = None
    if prov:
        global_summary = await refresh_user_summary(
            prov, user, db, user.preferred_lang.value
        )

    return ProfileResponse(
        user=UserProfile(
            name=user.email.split("@")[0],
            email=user.email,
            member_since=user.created_at.strftime("%Y-%m-%d"),
        ),
        stats=UserStats(
            total_chats=total_chats,
            total_messages=total_messages,
            favorite_model=favorite_model,
        ),
        summary=global_summary
        or "No AI summary available yet. Start chatting to generate personalized insights.",
    )


