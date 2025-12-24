#!/bin/bash

# Start development environment for Sijadin

echo "🚀 Starting Sijadin Development Environment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "✅ Please edit .env file with your configuration"
    exit 1
fi

# Start infrastructure services
echo "📦 Starting infrastructure services (PostgreSQL, Redis, MinIO)..."
docker-compose up -d postgres redis minio minio-init

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
docker-compose ps

echo ""
echo "✅ Infrastructure services started!"
echo ""
echo "Next steps:"
echo "1. Setup backend: cd apps/api && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
echo "2. Run migrations: cd apps/api && alembic upgrade head"
echo "3. Start API: cd apps/api && uvicorn main:app --reload"
echo "4. Setup frontend: cd apps/web && npm install && npm run dev"
echo ""
echo "Access points:"
echo "- API: http://localhost:8000"
echo "- API Docs: http://localhost:8000/docs"
echo "- Frontend: http://localhost:5173"
echo "- MinIO Console: http://localhost:9001 (minioadmin/minioadmin123)"
echo "- PostgreSQL: localhost:5432 (sijadin/sijadin123)"
echo "- Redis: localhost:6379"
