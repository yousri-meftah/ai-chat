#!/bin/bash
set -e

if command -v docker >/dev/null 2>&1; then
  echo "🐳 Docker found, using Docker Compose..."
  docker compose build
  docker compose up -d
  echo "✅ Backend: http://localhost:8000 | Frontend: http://localhost:5173"
else
  echo "⚠️  Docker not found, running locally..."

  echo "📦 Setting up backend..."
  python -m venv backend/venv
  source backend/venv/bin/activate
  pip install --upgrade pip
  pip install -r backend/requirements.txt
  uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 &
  deactivate

  echo "📦 Setting up frontend..."
  cd frontend
  npm install
  npm run dev
fi
