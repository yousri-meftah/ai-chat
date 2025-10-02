.PHONY: build up down logs run-local

DOCKER := $(shell where docker 2> NUL)

build:
ifdef DOCKER
	docker compose build
else
	@echo "❌ Docker not found. Use 'make run-local' to run without Docker."
endif

up:
ifdef DOCKER
	docker compose up -d
	@echo "✅ Services running at http://localhost:8000 (backend) and http://localhost:5173 (frontend)"
else
	@echo "❌ Docker not found. Use 'make run-local' to run without Docker."
endif

down:
ifdef DOCKER
	docker compose down
else
	@echo "❌ Docker not found."
endif

logs:
ifdef DOCKER
	docker compose logs -f
else
	@echo "❌ Docker not found."
endif

run-local:
	@echo "📦 Creating Python venv..."
	python -m venv backend/venv
	backend/venv/Scripts/activate && pip install --upgrade pip && pip install -r backend/requirements.txt

	@echo "🚀 Starting backend..."
	start cmd /k "cd backend && venv\\Scripts\\activate && uvicorn app.main:app --host 0.0.0.0 --port 8000"

	@echo "🚀 Starting frontend..."
	start cmd /k "cd frontend && npm install && npm run dev"
