# Development Guide - Sijadin

Panduan lengkap untuk menjalankan aplikasi Sijadin di local development.

## 🚀 Quick Start

### Pertama Kali Setup

1. **Setup Backend** (cukup sekali aja):
   ```bash
   npm run backend:setup
   ```
   Script ini akan:
   - Check Python & Docker
   - Start Docker services (PostgreSQL, Redis, MinIO)
   - Bikin virtual environment
   - Install semua dependencies Python

2. **Run Database Migrations**:
   ```bash
   npm run migrate
   ```

3. **Install Frontend Dependencies**:
   ```bash
   npm run frontend:install
   ```

### Jalanin Development Server

Setelah setup, tinggal jalanin 2 command ini di terminal terpisah:

**Terminal 1 - Backend:**
```bash
npm run backend
```
Backend akan jalan di: http://localhost:8000
API Docs: http://localhost:8000/docs

**Terminal 2 - Frontend:**
```bash
npm run frontend
```
Frontend akan jalan di: http://localhost:5173

## 📝 Available Commands

### Backend Commands
- `npm run backend` - Start backend development server (kayak npm run dev)
- `npm run backend:setup` - Setup backend (pertama kali aja)
- `npm run migrate` - Run database migrations

### Frontend Commands
- `npm run frontend` - Start frontend development server
- `npm run frontend:install` - Install frontend dependencies

### Docker Commands
- `npm run docker:up` - Start Docker services (PostgreSQL, Redis, MinIO)
- `npm run docker:down` - Stop Docker services
- `npm run docker:full` - Start semua services termasuk API & Worker

## 🔧 Manual Commands (Alternative)

Kalau mau jalanin manual tanpa npm:

### Backend
```bash
# Windows
scripts\dev-backend.bat

# Atau langsung
cd apps\api
venv\Scripts\activate
uvicorn main:app --reload
```

### Frontend
```bash
cd apps\web
npm run dev
```

## 🐛 Troubleshooting

### Backend gak bisa start
1. Pastikan Docker Desktop running
2. Check Docker services: `docker ps`
3. Restart Docker services: `npm run docker:up`

### Port sudah dipakai
- Backend (8000): Check apakah ada process lain di port 8000
- Frontend (5173): Check apakah ada Vite server lain running

### Virtual environment error
Hapus folder `apps/api/venv` dan run `npm run backend:setup` lagi

### Database connection error
```bash
# Restart Docker services
docker-compose down
docker-compose up -d postgres redis minio
```

## 📦 Tech Stack

- **Backend**: FastAPI + Python 3.11+
- **Frontend**: React + Vite + TypeScript
- **Database**: PostgreSQL + pgvector
- **Cache/Queue**: Redis
- **Storage**: MinIO (S3-compatible)

## 🎯 Development Workflow

1. Start Docker services (otomatis di `npm run backend`)
2. Start backend server: `npm run backend`
3. Start frontend server: `npm run frontend`
4. Open browser: http://localhost:5173
5. Code & enjoy hot reload! 🔥

## 📚 More Info

- Architecture: `ARCHITECTURE.md`
- API Documentation: http://localhost:8000/docs (setelah backend running)
- Quick Start: `QUICK_START.md`
