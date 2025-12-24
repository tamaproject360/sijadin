# Sijadin - Laporan Perjalanan Dinas (AI-assisted)

Aplikasi web untuk membuat laporan perjalanan dinas secara semi-otomatis dengan bantuan AI.

## Tech Stack

### Backend
- FastAPI (Python)
- PostgreSQL + pgvector
- Redis (Job Queue)
- MinIO (Object Storage)
- RQ Worker

### Frontend
- React + Vite
- TypeScript
- TailwindCSS
- Tiptap Editor

### AI/LLM
- LangChain
- Chutes AI / Gemini

## Prerequisites

- Docker & Docker Compose
- Python 3.11+
- Node.js 18+
- Git

## Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd sijadin
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file dan sesuaikan dengan konfigurasi Anda, terutama:
- `JWT_SECRET_KEY`
- `CHUTES_API_KEY` atau `GEMINI_API_KEY`

### 3. Start Infrastructure Services

```bash
# Start PostgreSQL, Redis, MinIO
docker-compose up -d postgres redis minio minio-init
```

Tunggu hingga semua services healthy (sekitar 30 detik).

### 4. Setup Backend (FastAPI)

```bash
cd apps/api

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start API server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API akan berjalan di: http://localhost:8000
API Docs: http://localhost:8000/docs

### 5. Setup Worker (RQ)

```bash
cd apps/worker

# Activate virtual environment
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Start worker
python worker.py
```

### 6. Setup Frontend (React)

```bash
cd apps/web

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend akan berjalan di: http://localhost:5173

## Development

### Database Migrations

```bash
cd apps/api

# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

### Access Services

- **Frontend**: http://localhost:5173
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **MinIO Console**: http://localhost:9001 (minioadmin / minioadmin123)
- **PostgreSQL**: localhost:5432 (sijadin / sijadin123)
- **Redis**: localhost:6379

## Project Structure

```
sijadin/
├── apps/
│   ├── api/              # FastAPI backend
│   ├── web/              # React frontend
│   └── worker/           # RQ worker
├── packages/
│   └── shared/           # Shared types/utilities
├── templates/
│   └── instansi_a/       # DOCX templates & schemas
├── data/                 # Local storage (dev)
│   ├── uploads/
│   └── exports/
├── scripts/              # Utility scripts
├── docker-compose.yml
├── .env.example
└── README.md
```

## Features

1. **Upload Dokumen**: Upload KAK, susunan acara, tiket, foto dokumentasi
2. **AI Processing**: Ekstraksi otomatis informasi dari dokumen
3. **Draft Generation**: Generate draft laporan sesuai template instansi
4. **Editor**: Edit draft dengan Tiptap editor
5. **Export**: Export ke DOCX dan PDF dengan format instansi

## Testing

### Backend Tests
```bash
cd apps/api
pytest
```

### Frontend Tests
```bash
cd apps/web
npm test
```

## Deployment

### Using Docker Compose (Full Stack)

```bash
# Build and start all services
docker-compose --profile full up -d --build

# View logs
docker-compose logs -f

# Stop all services
docker-compose --profile full down
```

## Troubleshooting

### PostgreSQL Connection Error
- Pastikan PostgreSQL container sudah running: `docker-compose ps`
- Check logs: `docker-compose logs postgres`

### MinIO Bucket Not Found
- Restart minio-init: `docker-compose up minio-init`

### Worker Not Processing Jobs
- Check Redis connection
- Check worker logs
- Verify RQ worker is running

## License

MIT

## Contributors

- Development Team
