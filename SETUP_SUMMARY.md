# Sijadin Setup Summary

## ✅ Phase 2-5 Implementation Complete

All backend authentication, API endpoints, job queue, and document parsing features have been implemented.

## 🔑 Default Login Credentials

After running the setup, you can login with:

- **Email**: `admin@sijadin.local`
- **Password**: `admin123`

## 📝 Setup Steps Required

### 1. Install Python (if not installed)
Download and install Python 3.11+ from: https://www.python.org/downloads/

Make sure to check "Add Python to PATH" during installation.

### 2. Run Database Migration

```bash
cd apps/api
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
```

### 3. Create Default User

```bash
# From apps/api directory with venv activated
python ../../scripts/create_default_user.py
```

This will create the admin user with credentials above.

### 4. Start the Services

**Terminal 1 - API:**
```bash
cd apps/api
venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Worker:**
```bash
cd apps/worker
venv\Scripts\activate
pip install -r requirements.txt
python worker.py
```

**Terminal 3 - Frontend:**
```bash
cd apps/web
npm install
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:5173
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs

Login with the default credentials above.

## 🧪 Test the Login

You can test if everything is working:

```bash
# Make sure API is running first
python scripts/test_login.py
```

## 📚 What's New in Phase 2-5

### Phase 2: Authentication ✅
- JWT-based authentication
- Password hashing with bcrypt
- Login, register, and user info endpoints
- Protected route middleware

### Phase 3: Reports & Files API ✅
- Create, list, view, update reports
- File upload with validation (PDF, DOCX, images)
- MinIO storage integration
- File download endpoint

### Phase 4: Job Queue ✅
- RQ worker setup
- Base job class with error handling
- Job trigger and status endpoints
- Progress tracking

### Phase 5: Document Parsing ✅
- PDF text extraction (PyMuPDF)
- DOCX text extraction (python-docx)
- Automatic file classification:
  - KAK/TOR
  - Agenda/Susunan Acara
  - Tiket Perjalanan
  - Undangan
  - Daftar Hadir
  - Foto Dokumentasi
- Facts building from extracted data

## 🎯 Try It Out

1. **Login** to the application
2. **Create a new report** with title and metadata
3. **Upload files** (PDF, DOCX, or images)
4. **Click "Proses Laporan"** to trigger processing
5. **Watch the progress** as files are classified and processed

## 📖 Documentation

- [Getting Started Guide](./GETTING_STARTED.md) - Detailed setup instructions
- [README.md](./README.md) - Project overview
- [PHASE_2_3_4_5_COMPLETED.md](./PHASE_2_3_4_5_COMPLETED.md) - Implementation details
- [Blueprint](./blueprint-lpj.md) - System design
- [Task List](./task.md) - Development progress

## 🐛 Troubleshooting

### Python not found
- Install Python 3.11+ from python.org
- Make sure to add Python to PATH
- Restart your terminal after installation

### Cannot create user
- Make sure database migration ran successfully
- Check PostgreSQL is running: `docker-compose ps postgres`
- Check .env file has correct DATABASE_URL

### API won't start
- Check if port 8000 is in use
- Verify all dependencies installed: `pip install -r requirements.txt`
- Check PostgreSQL connection

### Worker not processing
- Verify Redis is running: `docker-compose ps redis`
- Check worker logs for errors
- Make sure worker dependencies installed

## 🚀 Next Steps

After setup is complete, you can:

1. Test the full workflow (create → upload → process)
2. Explore the API documentation at http://localhost:8000/docs
3. Check MinIO console to see uploaded files: http://localhost:9001
4. Create additional users with `scripts/create_user.py`

---

**Need help?** Check the [Getting Started Guide](./GETTING_STARTED.md) or review the phase completion reports.
