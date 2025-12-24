# Getting Started with Sijadin

This guide will help you set up and run Sijadin for the first time.

## Prerequisites

Before you begin, make sure you have:

- ✅ Docker Desktop installed and running
- ✅ Python 3.11 or higher
- ✅ Node.js 18 or higher
- ✅ Git

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sijadin
```

### 2. Setup Environment Variables

```bash
# Copy example environment file
copy .env.example .env
```

Edit `.env` and update these important values:
- `JWT_SECRET_KEY` - Generate a secure random string
- `CHUTES_API_KEY` or `GEMINI_API_KEY` - Add your LLM API key (optional for now)

### 3. Start Infrastructure Services

```bash
# Start PostgreSQL, Redis, and MinIO
docker-compose up -d postgres redis minio minio-init

# Wait for services to be ready (about 30 seconds)
# Check status
docker-compose ps
```

All services should show "healthy" status.

### 4. Setup Backend API

Open a new terminal:

```bash
cd apps/api

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Create default user account
python ../../scripts/create_default_user.py

# Start API server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: http://localhost:8000

### 5. Setup Worker

Open another terminal:

```bash
cd apps/worker

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start worker
python worker.py
```

### 6. Setup Frontend

Open another terminal:

```bash
cd apps/web

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at: http://localhost:5173

## 🎉 You're Ready!

### Access the Application

1. Open your browser and go to: http://localhost:5173
2. Login with default credentials:
   - **Email**: `admin@sijadin.local`
   - **Password**: `admin123`

### Test the Login

You can test the login from command line:

```bash
python scripts/test_login.py
```

## What You Can Do Now

### 1. Create a Report

1. Click "Buat Laporan Baru" button
2. Fill in the report details:
   - Title: "Laporan Perjalanan Dinas Jakarta"
   - Activity Name: "Workshop AI"
   - Location: "Jakarta"
   - Dates: Select start and end dates
3. Click "Buat Laporan"

### 2. Upload Files

1. Click on the report you just created
2. Drag and drop files or click to upload:
   - PDF documents (KAK, agenda, tiket)
   - DOCX documents
   - Images (JPG, PNG)
3. Files will be uploaded to MinIO storage

### 3. Process the Report

1. After uploading files, click "Proses Laporan" button
2. The system will:
   - Extract text from PDF/DOCX files
   - Classify files automatically (KAK, agenda, tiket, foto, etc.)
   - Build facts from the documents
3. Watch the progress bar update in real-time
4. When complete, the report status will change to "Ready to Review"

## Available Services

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | admin@sijadin.local / admin123 |
| API | http://localhost:8000 | - |
| API Docs | http://localhost:8000/docs | - |
| MinIO Console | http://localhost:9001 | minioadmin / minioadmin123 |
| PostgreSQL | localhost:5432 | sijadin / sijadin123 |
| Redis | localhost:6379 | - |

## API Endpoints

### Authentication
```bash
# Register
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@sijadin.local", "password": "admin123"}'

# Get current user
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Reports
```bash
# Create report
curl -X POST http://localhost:8000/api/v1/reports \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Laporan Test", "activity_name": "Workshop"}'

# List reports
curl -X GET http://localhost:8000/api/v1/reports \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get report details
curl -X GET http://localhost:8000/api/v1/reports/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Files
```bash
# Upload file
curl -X POST http://localhost:8000/api/v1/files/reports/1/files \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@document.pdf"

# List files
curl -X GET http://localhost:8000/api/v1/files/reports/1/files \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Jobs
```bash
# Trigger processing
curl -X POST http://localhost:8000/api/v1/jobs/reports/1/process \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check job status
curl -X GET http://localhost:8000/api/v1/jobs/jobs/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### API won't start
- Check if port 8000 is already in use
- Verify PostgreSQL is running: `docker-compose ps postgres`
- Check API logs for errors

### Worker not processing jobs
- Verify Redis is running: `docker-compose ps redis`
- Check worker terminal for errors
- Make sure worker virtual environment is activated

### Frontend won't start
- Check if port 5173 is already in use
- Delete `node_modules` and run `npm install` again
- Check for Node.js version (must be 18+)

### Cannot login
- Verify you created the default user: `python scripts/create_default_user.py`
- Check API is running and accessible
- Open browser console (F12) to see error messages

### File upload fails
- Check MinIO is running: `docker-compose ps minio`
- Verify buckets exist in MinIO console (http://localhost:9001)
- Check file size (max 50MB)
- Verify file type is allowed (PDF, DOCX, JPG, PNG)

### Database connection error
- Restart PostgreSQL: `docker-compose restart postgres`
- Check DATABASE_URL in .env file
- Verify migrations ran: `alembic current`

## Next Steps

Now that you have Sijadin running, you can:

1. **Explore the API**: Visit http://localhost:8000/docs for interactive API documentation
2. **Create more users**: Run `python scripts/create_user.py` to add users
3. **Upload test documents**: Try uploading different types of documents
4. **Monitor jobs**: Watch the worker terminal to see job processing in real-time
5. **Check MinIO**: Login to MinIO console to see uploaded files

## Development Workflow

### Making Changes

1. **Backend changes**: The API will auto-reload when you save files
2. **Frontend changes**: Vite will hot-reload the browser
3. **Worker changes**: Restart the worker manually (Ctrl+C, then `python worker.py`)

### Database Changes

```bash
cd apps/api

# Create new migration
alembic revision --autogenerate -m "description"

# Apply migration
alembic upgrade head

# Rollback
alembic downgrade -1
```

### Viewing Logs

```bash
# Docker services
docker-compose logs -f postgres
docker-compose logs -f redis
docker-compose logs -f minio

# API logs - in the API terminal
# Worker logs - in the worker terminal
# Frontend logs - in the frontend terminal
```

## Need Help?

- Check [README.md](./README.md) for more details
- Read [blueprint-lpj.md](./blueprint-lpj.md) for system design
- See [task.md](./task.md) for development progress
- Review phase completion reports: `PHASE_*.md`

---

**Happy coding! 🚀**
