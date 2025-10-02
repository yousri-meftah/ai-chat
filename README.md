# 🤖 AI Chat Application – Fullstack

This project is an **AI-powered chatbot** (like Mistral/Gemini/Groq) that supports **English and Arabic**, with authentication, chat history, multiple AI models, and user summaries.

---

## 🚀 Features
- **Backend (FastAPI)**
  - JWT authentication (`/auth/signup`, `/auth/login`, `/auth/logout`, `/auth/profile`)
  - Chat & message storage in SQLite
  - Multiple AI providers (Groq, Gemini, Mistral)
  - Automatic chat summaries for context
  - User global profile summary
  - Rate limiting (SlowAPI)
  - i18n support (English + Arabic)

- **Frontend (React/Vue)**
  - Ready-to-use chatbot interface
  - i18n JSON files for English/Arabic
  - Simple build/run with `npm`

---

## ⚙️ Requirements
- **Option A (Recommended)**: [Docker](https://docs.docker.com/get-docker/)
- **Option B (Local run)**: Python 3.11+, Node.js 20+, npm

---

## 🛠️ Setup Instructions

### 1. Clone repository
```bash
git clone https://github.com/yousri-meftah/ai-chat.git
cd ai-chat
```

### 2. Environment variables
Create a `.env` file in `/backend/app/core`:

```ini
APP_NAME=AI Chat Backend
APP_ENV=dev
BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:8080

JWT_SECRET=super_secret_key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=120

DATABASE_URL=sqlite:///./app.db

GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key
MISTRAL_API_KEY=your_mistral_key
```

---

## ▶️ Run Instructions

### Option A – With Docker
```bash
./run.sh
```
or on Windows:
```bat
run.bat
```

- Backend available at: [http://localhost:8000/docs](http://localhost:8000/docs)  
- Frontend (dev mode): [http://localhost:8080](http://localhost:8080)

### Option B – Without Docker

**Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate #linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 Backend API Routes

### Health
- `GET /healthz` → service check

### Authentication
- `POST /auth/signup` → register user  
- `POST /auth/login` → login + JWT  
- `POST /auth/logout` → logout  
- `GET /auth/profile` → profile + stats + summary (requires JWT)

### Chats
- `GET /chats` → list user chats  
- `GET /chats/{chat_id}` → fetch a chat with messages  
- `DELETE /chats/{chat_id}` → delete a chat

### Messages
- `POST /messages/send` → send a message to AI  
  - if `chat_id=null` → creates a new chat  
  - auto-saves messages + updates chat summary  

---

## 📊 Example Request (Send Message)

```http
POST /messages/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "chat_id": null,
  "content": "Hello! Tell me something about space.",
  "model": "groq"
}
```

Response:
```json
{
  "chat_id": 1,
  "chat_title": "Hello! Tell me something...",
  "user_message": {
    "id": 10,
    "role": "user",
    "content": "Hello! Tell me something about space.",
    "lang": "en"
  },
  "assistant_message": {
    "id": 11,
    "role": "assistant",
    "content": "Did you know space is completely silent?",
    "model": "groq",
    "lang": "en"
  },
  "chat_summary": "User asked about space; assistant explained it's silent."
}
```

---

## 🖥️ Frontend

**Development**
```bash
cd frontend
npm install
npm run dev
```
Runs at [http://localhost:8080](http://localhost:8080)

**Production Build**
```bash
npm run build
```
Static files are generated in `/dist` (or `/build` for CRA).  
These can be served by Nginx or mounted in FastAPI.

---

## 📦 Deployment Notes
- Use **Docker Compose** to run both backend & frontend in production.  
- Optionally serve frontend static build via **Nginx**.  
- Backend requires `.env` for API keys.  


