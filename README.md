# Sijadin - Laporan Perjalanan Dinas (AI-assisted)

Aplikasi web untuk membuat laporan perjalanan dinas secara semi-otomatis dengan bantuan AI.

## 🚀 Status Implementasi

- ✅ **Phase 0**: Project Setup & Infrastructure
- ✅ **Phase 1**: Backend Foundation (FastAPI)
- ✅ **Phase 2**: Authentication & Authorization
- ✅ **Phase 3**: Core API - Reports & Files
- ✅ **Phase 4**: Async Job Queue (RQ/Worker)
- ✅ **Phase 5**: Document Parsing & Extraction
- ✅ **Phase 12**: Frontend Foundation (React + Vite)
- ✅ **Phase 13**: Frontend - Auth Pages
- ✅ **Phase 14**: Frontend - Report List & Create
- ✅ **Phase 15**: Frontend - Report Detail & Upload
- ⬜ **Phase 6-11**: LLM, RAG, Draft Generation, Export (In Progress)
- ⬜ **Phase 16-17**: Draft Editor & Export UI (Planned)

## 📋 Quick Start

**New to Sijadin?** Check out the [Getting Started Guide](./GETTING_STARTED.md) for detailed setup instructions.

### Prerequisites
- Docker & Docker Compose
- Python 3.11+
- Node.js 18+

### Option 1: Automated Setup (Windows)

```bash
# Run setup script
scripts\setup-dev.bat

# Start all services
scripts\start-dev.bat
```

**Default Login:**
- Email: `admin@sijadin.local`
- Password: `admin123`

### Option 2: Manual Setup

See detailed instructions below.

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

### Prerequisites
- Docker & Docker Compose
- Python 3.11+
- Node.js 18+

### Option 1: Automated Setup (Windows)

```bash
# Run setup script
scripts\setup-dev.bat

# Start all services
scripts\start-dev.bat
```

### Option 2: Manual Setup

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

# Create default user account
python ../scripts/create_default_user.py

# Start API server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Default Login Credentials:**
- Email: `admin@sijadin.local`
- Password: `admin123`

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

### Create User Account

Untuk membuat user baru secara manual:

```bash
cd apps/api
python ../scripts/create_user.py
```

Atau gunakan default user yang sudah dibuat:
- Email: `admin@sijadin.local`
- Password: `admin123`

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
│   │   ├── app/
│   │   │   ├── api/v1/   # API endpoints
│   │   │   ├── core/     # Config, database, security
│   │   │   ├── models/   # SQLAlchemy models
│   │   │   ├── schemas/  # Pydantic schemas
│   │   │   ├── services/ # Business logic
│   │   │   └── utils/    # Utilities (MinIO, etc.)
│   │   ├── alembic/      # Database migrations
│   │   └── main.py       # FastAPI app
│   ├── web/              # React frontend
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   ├── pages/       # Page components
│   │   │   ├── lib/         # Utilities (axios, etc.)
│   │   │   └── types/       # TypeScript types
│   │   └── index.html
│   └── worker/           # RQ worker
│       ├── parsers/      # Document parsers
│       ├── tasks/        # Job tasks
│       ├── base_job.py   # Base job class
│       └── worker.py     # Worker entry point
├── packages/
│   └── shared/           # Shared types/utilities
├── templates/
│   └── instansi_a/       # DOCX templates & schemas
├── data/                 # Local storage (dev)
│   ├── uploads/
│   └── exports/
├── scripts/              # Utility scripts
│   ├── create_user.py
│   ├── create_default_user.py
│   └── init-pgvector.sql
├── docker-compose.yml
├── .env.example
└── README.md
```

## Features

### ✅ Implemented
1. **Authentication**: JWT-based login/register system
2. **Report Management**: Create, list, view, and update reports
3. **File Upload**: Upload documents (PDF, DOCX) and images with validation
4. **Async Processing**: Background job queue for document processing
5. **Document Parsing**: 
   - PDF text extraction (PyMuPDF)
   - DOCX text extraction (python-docx)
   - Automatic file classification (KAK, agenda, tiket, foto, etc.)
6. **Job Monitoring**: Real-time job status and progress tracking
7. **MinIO Storage**: Secure file storage with S3-compatible API

### 🚧 In Progress
8. **LLM Integration**: Chutes AI / Gemini for content generation
9. **RAG System**: pgvector-based document retrieval
10. **Draft Generation**: AI-powered report draft creation
11. **Draft Editor**: Tiptap-based rich text editor
12. **Export**: DOCX and PDF export with templates

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT token
- `GET /api/v1/auth/me` - Get current user info

### Reports
- `POST /api/v1/reports` - Create new report
- `GET /api/v1/reports` - List reports (paginated)
- `GET /api/v1/reports/{id}` - Get report details
- `PATCH /api/v1/reports/{id}` - Update report metadata

### Files
- `POST /api/v1/files/reports/{id}/files` - Upload file
- `GET /api/v1/files/reports/{id}/files` - List files
- `GET /api/v1/files/files/{file_id}/download` - Download file

### Jobs
- `POST /api/v1/jobs/reports/{id}/process` - Trigger processing
- `GET /api/v1/jobs/jobs/{job_id}` - Get job status

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

### Cannot Login
- Pastikan sudah membuat user: `python scripts/create_default_user.py`
- Default credentials: `admin@sijadin.local` / `admin123`
- Check API logs untuk error details

### File Upload Failed
- Check MinIO is running: `docker-compose ps minio`
- Verify buckets exist: Login to MinIO console (http://localhost:9001)
- Check file size (max 50MB by default)
- Verify MIME type is allowed (PDF, DOCX, JPG, PNG)

## Documentation

- [Blueprint](./blueprint-lpj.md) - Detailed system design
- [Task List](./task.md) - Development task tracking
- [Architecture](./ARCHITECTURE.md) - System architecture
- [Phase Completion Reports](./PHASE_*.md) - Implementation progress

## License

MIT

## Contributors

- Development Team
