from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.db.session import engine
from app.db.base import Base
from app.auth.router import router as auth_router
from app.chats.router import router as chats_router
from app.ai.router import router as ai_router
from app.messages.router import router as messages_router

settings = get_settings()

# the best way is to use migration tools like alembic, but for simplicity we use this
Base.metadata.create_all(bind=engine)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title=settings.APP_NAME)
app.state.limiter = limiter

# ✅ Proper middleware for slowapi
app.add_middleware(SlowAPIMiddleware)

# ✅ Custom JSON error handler instead of default HTML
@app.exception_handler(RateLimitExceeded)
def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests, please slow down."}
    )

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthz")
@limiter.limit("10/minute")
def healthz(request: Request):   
    return {"status": "ok"}

app.include_router(auth_router)
app.include_router(chats_router)
app.include_router(ai_router)
app.include_router(messages_router)

@app.middleware("http")
async def add_lang_header(request: Request, call_next):
    response = await call_next(request)
    response.headers["Content-Language"] = request.headers.get("X-User-Lang", settings.DEFAULT_LANG)
    return response
