# Sijadin - Laporan Perjalanan Dinas (AI-assisted)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-teal.svg)
![React](https://img.shields.io/badge/React-18.3+-61dafb.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Aplikasi web untuk membuat laporan perjalanan dinas secara semi-otomatis dengan bantuan AI. Sistem ini mengotomatisasi proses pembuatan laporan dari dokumen-dokumen pendukung menggunakan teknologi AI/LLM.

## ✨ Key Features

- 🔐 **Secure Authentication** - JWT-based authentication with persistent sessions
- 📝 **Report Management** - Create, manage, and track travel reports
- 📁 **File Upload** - Drag & drop file upload with automatic classification
- ⚡ **Async Processing** - Background job processing with Celery
- 🤖 **AI-Powered** - LLM integration for intelligent content generation
- 📊 **Analytics** - Comprehensive dashboard with statistics and insights
- 🎨 **Modern UI** - Beautiful glassmorphism design with smooth animations
- 📱 **Responsive** - Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

**Jalanin development server semudah npm run dev:**

```bash
# Setup pertama kali (sekali aja)
npm run backend:setup
npm run migrate
npm run frontend:install

# Jalanin backend (Terminal 1)
npm run backend

# Jalanin frontend (Terminal 2)
npm run frontend
```

📖 **Dokumentasi**:
- [CHEAT_SHEET.md](CHEAT_SHEET.md) - Command cepat
- [DEV_GUIDE.md](DEV_GUIDE.md) - Panduan lengkap

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
- ✅ **Analytics**: Dashboard analytics & statistics
- ⬜ **Phase 6-11**: LLM, RAG, Draft Generation, Export (In Progress)
- ⬜ **Phase 16-17**: Draft Editor & Export UI (Planned)

## 📋 Quick Start

**New to Sijadin?** 
- 🚀 [Simple Start Guide](./SIMPLE_START_GUIDE.md) - Panduan simpel untuk mulai development
- 📖 [Getting Started Guide](./GETTING_STARTED.md) - Detailed setup instructions

### Prerequisites
- Docker & Docker Compose
- Python 3.11+
- Node.js 18+

### Automated Setup (Windows)

```bash
# Run setup script
scripts\setup-dev.bat

# Start backend (API + Worker)
scripts\backend-start.bat

# Start frontend (in another terminal)
scripts\frontend-start.bat
```

**Default Login:**
- Email: `admin@sijadin.local`
- Password: `admin123`

### Quick Commands

```bash
# Backend
scripts\backend-start.bat      # Start backend
scripts\backend-restart.bat    # Restart backend
scripts\backend-stop.bat       # Stop backend

# Frontend
scripts\frontend-start.bat     # Start frontend
scripts\frontend-restart.bat   # Restart frontend

# All services
scripts\start-dev.bat          # Start all
scripts\restart-all.bat        # Restart all
scripts\stop-dev.bat           # Stop all
```

**Having issues?** Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)

---

## 📖 Manual Setup

For detailed manual setup instructions, see sections below or check [Getting Started Guide](./GETTING_STARTED.md).

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL + pgvector** - Database with vector search
- **Redis** - Job queue and caching
- **MinIO** - S3-compatible object storage
- **Celery** - Distributed task queue

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Tiptap** - Rich text editor
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **Axios** - HTTP client

### AI/LLM
- **LangChain** - LLM framework
- **Chutes AI / Gemini** - LLM providers
- **pgvector** - Vector similarity search

### DevOps
- **Docker & Docker Compose** - Containerization
- **Alembic** - Database migrations
- **Uvicorn** - ASGI server

---

## Prerequisites

- Docker & Docker Compose
- Python 3.11+
- Node.js 18+
- Git

---

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
- `JWT_SECRET_KEY` - Secret key untuk JWT token
- `CHUTES_API_KEY` atau `GEMINI_API_KEY` - API key untuk LLM provider
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `MINIO_*` - MinIO configuration

**Frontend Environment:**
```bash
cd apps/web
echo VITE_API_URL=http://localhost:8000/api/v1 > .env
cd ../..
```

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

# Create .env file
echo VITE_API_URL=http://localhost:8000/api/v1 > .env

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend akan berjalan di: http://localhost:5173

## Development

### Development Workflow

1. **Start Infrastructure**
   ```bash
   docker-compose up -d postgres redis minio
   ```

2. **Start Backend**
   ```bash
   cd apps/api
   venv\Scripts\activate  # Windows
   uvicorn main:app --reload
   ```

3. **Start Worker**
   ```bash
   cd apps/worker
   venv\Scripts\activate  # Windows
   python -m celery -A worker worker --loglevel=info --pool=solo
   ```

4. **Start Frontend**
   ```bash
   cd apps/web
   npm run dev
   ```

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

### Hot Reload

- **Backend**: Uvicorn auto-reload enabled dengan `--reload` flag
- **Frontend**: Vite HMR (Hot Module Replacement) enabled by default
- **Worker**: Restart manual diperlukan setelah code changes

### Access Services

- **Frontend**: http://localhost:5173
  - Login page: `/login`
  - Dashboard: `/`
  - Reports: `/reports`
  - Analytics: `/analytics`
- **API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs
- **API Docs (ReDoc)**: http://localhost:8000/redoc
- **MinIO Console**: http://localhost:9001
  - Username: `minioadmin`
  - Password: `minioadmin123`
- **PostgreSQL**: `localhost:5432`
  - Database: `sijadin_db`
  - Username: `postgres`
  - Password: `password`
- **Redis**: `localhost:6379`

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
1. **Authentication**: JWT-based login/register system with persistent sessions
2. **Report Management**: Create, list, view, and update reports with full CRUD operations
3. **File Upload**: Upload documents (PDF, DOCX) and images with validation
4. **Async Processing**: Background job queue for document processing with Celery
5. **Document Parsing**: 
   - PDF text extraction (PyMuPDF)
   - DOCX text extraction (python-docx)
   - Automatic file classification (KAK, agenda, tiket, foto, etc.)
6. **Job Monitoring**: Real-time job status and progress tracking
7. **MinIO Storage**: Secure file storage with S3-compatible API
8. **Analytics Dashboard**: 
   - Report statistics and metrics
   - Status distribution charts
   - Top locations tracking
   - Monthly report trends
9. **Modern UI/UX**:
   - Responsive design with TailwindCSS
   - Smooth animations with Framer Motion
   - Glassmorphism design system
   - Drag & drop file upload
10. **Frontend Pages**:
   - Login & Authentication
   - Dashboard with quick stats
   - Reports list with filtering
   - Report detail with file management
   - Analytics dashboard with charts
   - File upload with progress tracking

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
- `GET /api/v1/reports` - List reports (paginated, filterable)
- `GET /api/v1/reports/{id}` - Get report details
- `PATCH /api/v1/reports/{id}` - Update report metadata

### Files
- `POST /api/v1/files/reports/{id}/files` - Upload file
- `GET /api/v1/files/reports/{id}/files` - List files
- `GET /api/v1/files/files/{file_id}/download` - Download file
- `DELETE /api/v1/files/files/{file_id}` - Delete file

### Jobs
- `POST /api/v1/jobs/reports/{id}/process` - Trigger processing
- `GET /api/v1/jobs/jobs/{job_id}` - Get job status

### Analytics
- `GET /api/v1/analytics` - Get analytics data and statistics

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

### Production Considerations

1. **Environment Variables**
   - Change `JWT_SECRET_KEY` to a secure random string
   - Use strong passwords for PostgreSQL, Redis, MinIO
   - Set `ENVIRONMENT=production`
   - Configure proper `CORS_ORIGINS`

2. **Database**
   - Use managed PostgreSQL service (AWS RDS, etc.)
   - Enable SSL connections
   - Regular backups

3. **File Storage**
   - Use managed S3 or MinIO cluster
   - Enable encryption at rest
   - Configure CDN for file delivery

4. **API Server**
   - Use production ASGI server (Gunicorn + Uvicorn workers)
   - Enable HTTPS with SSL certificates
   - Configure rate limiting
   - Set up monitoring and logging

5. **Frontend**
   - Build for production: `npm run build`
   - Serve with Nginx or CDN
   - Enable gzip compression
   - Configure caching headers

6. **Worker**
   - Run multiple worker instances
   - Configure auto-restart on failure
   - Set up monitoring for job queue

7. **Security**
   - Enable HTTPS everywhere
   - Configure firewall rules
   - Regular security updates
   - Implement rate limiting
   - Enable CORS properly

## Troubleshooting

**For detailed troubleshooting guide, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**

### Common Issues

#### Cannot Access Reports/Analytics Page
```bash
# Quick fix
scripts\fix-web-access.bat

# Or restart all services
scripts\restart-all.bat
```

#### PostgreSQL Connection Error
- Pastikan PostgreSQL container sudah running: `docker-compose ps`
- Check logs: `docker-compose logs postgres`

#### MinIO Bucket Not Found
- Restart minio-init: `docker-compose up minio-init`

#### Worker Not Processing Jobs
- Check Redis connection
- Check worker logs
- Verify Celery worker is running

#### Cannot Login
- Pastikan sudah membuat user: `python scripts/create_default_user.py`
- Default credentials: `admin@sijadin.local` / `admin123`
- Check API logs untuk error details

#### File Upload Failed
- Check MinIO is running: `docker-compose ps minio`
- Verify buckets exist: Login to MinIO console (http://localhost:9001)
- Check file size (max 50MB by default)
- Verify MIME type is allowed (PDF, DOCX, JPG, PNG)

#### Frontend Shows Blank Page
```bash
cd apps\web
# Clean cache
rmdir /s /q node_modules\.vite
# Restart
npm run dev
```

## Documentation

- [Simple Start Guide](./SIMPLE_START_GUIDE.md) - 🚀 Panduan simpel untuk mulai development
- [Scripts Guide](./scripts/README.md) - Penjelasan lengkap semua script
- [Getting Started Guide](./GETTING_STARTED.md) - Setup instructions for new developers
- [Quick Reference](./QUICK_REFERENCE.md) - Quick commands and common tasks
- [Latest Updates](./LATEST_UPDATES.md) - Recent changes and new features
- [Troubleshooting Guide](./TROUBLESHOOTING.md) - Common issues and solutions
- [Blueprint](./blueprint-lpj.md) - Detailed system design
- [Task List](./task.md) - Development task tracking
- [Architecture](./ARCHITECTURE.md) - System architecture
- [Phase Completion Reports](./PHASE_*.md) - Implementation progress

## Roadmap

### Current Phase (In Progress)
- [ ] LLM Integration (Phase 6-7)
- [ ] RAG System with pgvector (Phase 8-9)
- [ ] Draft Generation (Phase 10-11)

### Next Phase (Planned)
- [ ] Rich Text Editor (Phase 16)
- [ ] Export to DOCX/PDF (Phase 17)
- [ ] Template Management
- [ ] Multi-user collaboration
- [ ] Advanced analytics
- [ ] Mobile responsive improvements

### Future Enhancements
- [ ] Real-time collaboration
- [ ] Version control for reports
- [ ] Advanced search with filters
- [ ] Notification system
- [ ] Email integration
- [ ] API rate limiting
- [ ] Audit logs
- [ ] Role-based permissions

## Available Scripts

- [Getting Started Guide](./GETTING_STARTED.md) - Setup instructions for new developers
- [Troubleshooting Guide](./TROUBLESHOOTING.md) - Common issues and solutions
- [Blueprint](./blueprint-lpj.md) - Detailed system design
- [Task List](./task.md) - Development task tracking
- [Architecture](./ARCHITECTURE.md) - System architecture
- [Phase Completion Reports](./PHASE_*.md) - Implementation progress

## Available Scripts

### Main Scripts (Most Used)

**Backend:**
- `scripts\backend-start.bat` - Start backend (API + Worker + Infrastructure)
- `scripts\backend-restart.bat` - Restart backend
- `scripts\backend-stop.bat` - Stop backend

**Frontend:**
- `scripts\frontend-start.bat` - Start frontend dev server
- `scripts\frontend-restart.bat` - Restart frontend with cache clean

**All Services:**
- `scripts\start-dev.bat` - Start all services
- `scripts\restart-all.bat` - Restart all services
- `scripts\stop-dev.bat` - Stop all services

### Setup & Management
- `scripts\setup-dev.bat` - Initial setup (first time only)
- `scripts\create_default_user.py` - Create default admin user
- `scripts\create_user.py` - Create custom user account
- `scripts\test_login.py` - Test login functionality

### Troubleshooting
- `scripts\fix-web-access.bat` - Fix web access issues
- `scripts\restart-api.bat` - Restart API server only

**For detailed script documentation, see [scripts/README.md](./scripts/README.md)**

## License

MIT

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Review [Getting Started Guide](./GETTING_STARTED.md)

## Contributors

- Development Team
