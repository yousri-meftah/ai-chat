from pydantic import BaseModel, EmailStr
from app.db.models import Lang

class SignupIn(BaseModel):
    email: EmailStr
    password: str
    preferred_lang: Lang = Lang.en

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    
class UserProfile(BaseModel):
    name: str
    email: EmailStr
    member_since: str


class UserStats(BaseModel):
    total_chats: int
    total_messages: int
    favorite_model: str


class ProfileResponse(BaseModel):
    user: UserProfile
    stats: UserStats
    summary: str
