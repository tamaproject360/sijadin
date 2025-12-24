# Quick Reference Card

## 🚀 Quick Commands

### Backend (API + Worker)
```bash
# Start backend
scripts\backend-start.bat

# Restart backend
scripts\backend-restart.bat

# Stop backend
scripts\backend-stop.bat
```

### Frontend
```bash
# Start frontend
scripts\frontend-start.bat

# Restart frontend (clean cache)
scripts\frontend-restart.bat
```

### All Services
```bash
# Start all services
scripts\start-dev.bat

# Restart all services
scripts\restart-all.bat

# Stop all services
scripts\stop-dev.bat
```

### Troubleshooting
```bash
# Fix web access issues
scripts\fix-web-access.bat

# Restart API only
scripts\restart-api.bat
```

### Development
```bash
# API
cd apps\api
venv\Scripts\activate
uvicorn main:app --reload

# Worker
cd apps\worker
venv\Scripts\activate
python -m celery -A worker worker --loglevel=info --pool=solo

# Web
cd apps\web
npm run dev
```

### Database
```bash
cd apps\api

# Create migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

### User Management
```bash
cd apps\api

# Create default admin user
python ..\scripts\create_default_user.py

# Create custom user
python ..\scripts\create_user.py

# Test login
python ..\scripts\test_login.py
```

## 🌐 Service URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | admin@sijadin.local / admin123 |
| API | http://localhost:8000 | - |
| API Docs | http://localhost:8000/docs | - |
| MinIO Console | http://localhost:9001 | minioadmin / minioadmin123 |
| PostgreSQL | localhost:5432 | postgres / password |
| Redis | localhost:6379 | - |

## 📁 Project Structure

```
sijadin/
├── apps/
│   ├── api/              # FastAPI backend
│   │   ├── app/
│   │   │   ├── api/v1/endpoints/  # API routes
│   │   │   ├── core/              # Config, DB, security
│   │   │   ├── models/            # SQLAlchemy models
│   │   │   ├── schemas/           # Pydantic schemas
│   │   │   └── services/          # Business logic
│   │   └── alembic/               # DB migrations
│   ├── web/              # React frontend
│   │   └── src/
│   │       ├── components/        # React components
│   │       ├── pages/             # Page components
│   │       ├── lib/               # Utilities
│   │       └── types/             # TypeScript types
│   └── worker/           # Celery worker
│       ├── parsers/               # Document parsers
│       └── tasks/                 # Background tasks
├── scripts/              # Utility scripts
├── templates/            # DOCX templates
└── data/                 # Local storage
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Current user

### Reports
- `POST /api/v1/reports` - Create report
- `GET /api/v1/reports` - List reports
- `GET /api/v1/reports/{id}` - Get report
- `PATCH /api/v1/reports/{id}` - Update report

### Files
- `POST /api/v1/files/reports/{id}/files` - Upload file
- `GET /api/v1/files/reports/{id}/files` - List files
- `GET /api/v1/files/files/{file_id}/download` - Download
- `DELETE /api/v1/files/files/{file_id}` - Delete file

### Jobs
- `POST /api/v1/jobs/reports/{id}/process` - Start processing
- `GET /api/v1/jobs/jobs/{job_id}` - Job status

### Analytics
- `GET /api/v1/analytics` - Get analytics data

## 🐛 Common Issues

### Cannot access reports/analytics
```bash
scripts\fix-web-access.bat
```

### API not responding
```bash
scripts\restart-api.bat
```

### Worker not processing
```bash
# Check Redis
docker-compose ps redis

# Restart worker
cd apps\worker
python -m celery -A worker worker --loglevel=info --pool=solo
```

### Database connection error
```bash
# Check PostgreSQL
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Frontend blank page
```bash
cd apps\web
rmdir /s /q node_modules\.vite
npm run dev
```

### Cannot login
```bash
# Create default user
cd apps\api
python ..\scripts\create_default_user.py
```

## 🔧 Environment Variables

### Root .env
```env
# Database
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/sijadin_db

# Redis
REDIS_URL=redis://localhost:6379/0

# MinIO
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123

# JWT
JWT_SECRET_KEY=your-secret-key-change-this

# LLM
LLM_PROVIDER=chutes
CHUTES_API_KEY=your-api-key

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### apps/web/.env
```env
VITE_API_URL=http://localhost:8000/api/v1
```

## 📊 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | TailwindCSS, Framer Motion |
| State | Zustand, React Query |
| Backend | FastAPI, Python 3.11+ |
| Database | PostgreSQL + pgvector |
| Cache/Queue | Redis, Celery |
| Storage | MinIO (S3-compatible) |
| AI/LLM | LangChain, Chutes/Gemini |

## 📝 Development Workflow

1. **Start infrastructure**
   ```bash
   docker-compose up -d postgres redis minio
   ```

2. **Start backend**
   ```bash
   cd apps\api
   venv\Scripts\activate
   uvicorn main:app --reload
   ```

3. **Start worker**
   ```bash
   cd apps\worker
   venv\Scripts\activate
   python -m celery -A worker worker --loglevel=info --pool=solo
   ```

4. **Start frontend**
   ```bash
   cd apps\web
   npm run dev
   ```

5. **Make changes and test**

6. **Create migration if needed**
   ```bash
   cd apps\api
   alembic revision --autogenerate -m "description"
   alembic upgrade head
   ```

## 🎯 Testing

### Test Login
```bash
cd apps\api
python ..\scripts\test_login.py
```

### Test API
```bash
# Using curl
curl http://localhost:8000/api/v1/

# Using browser
http://localhost:8000/docs
```

### Test Frontend
```bash
# Open browser
http://localhost:5173
```

## 📚 Documentation

- [README.md](./README.md) - Main documentation
- [GETTING_STARTED.md](./GETTING_STARTED.md) - Setup guide
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues
- [LATEST_UPDATES.md](./LATEST_UPDATES.md) - Recent changes
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design

## 💡 Tips

- Use API docs at `/docs` for testing endpoints
- Check browser console (F12) for frontend errors
- Use `--reload` flag for auto-restart during development
- Clear browser cache if UI doesn't update
- Check logs in terminal for error messages
- Use incognito mode to test without cache

## 🔐 Default Credentials

**Admin User:**
- Email: `admin@sijadin.local`
- Password: `admin123`

**MinIO:**
- Username: `minioadmin`
- Password: `minioadmin123`

**PostgreSQL:**
- Username: `postgres`
- Password: `password`
- Database: `sijadin_db`

---

**Quick Help**: For detailed help, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
