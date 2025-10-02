from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from sqlalchemy.orm import Session
from app.core.security import decode_token
from app.db.session import SessionLocal
from app.db.models import User

security = HTTPBearer(auto_error=True)

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security),
                     db: Session = Depends(get_db)) -> User:
    token = creds.credentials
    try:
        payload = decode_token(token)
        email = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = db.query(User).filter(User.email==email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user
