# Sijadin - Quick Start Guide

## ⚡ Fast Setup (5 minutes)

### Prerequisites
- Docker & Docker Compose installed
- Python 3.11+ installed
- Git installed

### Step 1: Clone & Configure (1 min)
```bash
# Clone repository
git clone <repository-url>
cd sijadin

# Copy environment file
cp .env.example .env

# Edit .env and set your API keys:
# - JWT_SECRET_KEY (generate random string)
# - CHUTES_API_KEY or GEMINI_API_KEY
```

### Step 2: Start Infrastructure (2 min)
```bash
# Windows
scripts\start-dev.bat

# Linux/Mac
bash scripts/start-dev.sh

# Wait for services to be ready (~30 seconds)
```

### Step 3: Setup Backend (2 min)
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

# Run database migrations
alembic upgrade head

# Start API server
uvicorn main:app --reload
```

### Step 4: Verify Setup
Open browser and check:
- ✅ API: http://localhost:8000
- ✅ API Docs: http://localhost:8000/docs
- ✅ MinIO Console: http://localhost:9001

---

## 🎯 What's Working Now

### ✅ Infrastructure
- PostgreSQL database with pgvector extension
- Redis for job queue
- MinIO for file storage
- All services running in Docker

### ✅ Backend API
- FastAPI application
- Database models (8 tables)
- Database migrations
- MinIO client utility
- Health check endpoint

### ✅ Database Schema
- `users` - User accounts with roles
- `organizations` - Organizations/units
- `doc_templates` - DOCX templates
- `reports` - Report metadata
- `report_files` - Uploaded files
- `report_draft_versions` - Draft versions
- `job_runs` - Job tracking
- `exports` - Export history

---

## 📋 Next Development Steps

### Phase 2: Authentication (Next)
- [ ] Password hashing
- [ ] JWT token generation
- [ ] Login/register endpoints
- [ ] Auth middleware

### Phase 3: Core API
- [ ] Report CRUD endpoints
- [ ] File upload endpoints
- [ ] File download endpoints

### Phase 4: Worker
- [ ] RQ worker setup
- [ ] Job processing pipeline
- [ ] Document parsing

---

## 🔧 Development Commands

### Backend
```bash
# Start API
cd apps/api
uvicorn main:app --reload

# Create migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

### Docker
```bash
# Start services
docker-compose up -d postgres redis minio

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### Database
```bash
# Connect to PostgreSQL
docker exec -it sijadin_postgres psql -U sijadin -d sijadin_db

# Check tables
\dt

# Check pgvector extension
SELECT * FROM pg_extension WHERE extname = 'vector';
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
# Windows:
netstat -ano | findstr :8000

# Linux/Mac:
lsof -i :8000

# Kill the process or change port in .env
```

### Docker Services Not Starting
```bash
# Check Docker is running
docker --version

# Restart Docker Desktop
# Then try again:
docker-compose up -d
```

### Database Connection Error
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### MinIO Buckets Not Created
```bash
# Restart minio-init
docker-compose up minio-init

# Or create manually via console:
# http://localhost:9001
```

---

## 📚 Documentation

- `README.md` - Full project documentation
- `ARCHITECTURE.md` - System architecture
- `PHASE_0_1_COMPLETED.md` - Phase 0 & 1 completion report
- `blueprint-lpj.md` - Original blueprint
- `task.md` - Task list with progress

---

## 🎉 Success Indicators

You're ready to develop when you see:

1. ✅ API running at http://localhost:8000
2. ✅ API docs accessible at http://localhost:8000/docs
3. ✅ MinIO console at http://localhost:9001
4. ✅ No errors in terminal
5. ✅ Database tables created (check with `\dt` in psql)

---

## 💡 Tips

- Use API docs (http://localhost:8000/docs) to test endpoints
- Check MinIO console to verify file uploads
- Use `docker-compose logs -f` to debug issues
- Keep terminal windows open to see logs
- Use `.env` file for configuration (never commit it!)

---

**Ready to code!** 🚀
