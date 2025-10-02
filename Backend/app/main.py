from fastapi import FastAPI, Request, APIRouter
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

Base.metadata.create_all(bind=engine)

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title=settings.APP_NAME)
app.state.limiter = limiter

app.add_middleware(SlowAPIMiddleware)

@app.exception_handler(RateLimitExceeded)
def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests, please slow down."}
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# api_router = APIRouter(prefix="/api")
api_router = APIRouter()

@api_router.get("/healthz")
@limiter.limit("10/minute")
def healthz(request: Request):   
    return {"status": "ok"}

api_router.include_router(auth_router)
api_router.include_router(chats_router)
api_router.include_router(ai_router)
api_router.include_router(messages_router)

app.include_router(api_router)

@app.middleware("http")
async def add_lang_header(request: Request, call_next):
    response = await call_next(request)
    response.headers["Content-Language"] = request.headers.get("X-User-Lang", settings.DEFAULT_LANG)
    return response
