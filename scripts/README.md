# Scripts Guide

## 🚀 NEW: Simple Development Commands (RECOMMENDED)

Sekarang lo bisa jalanin backend semudah frontend!

### Backend Development
```bash
# Setup pertama kali (sekali aja)
npm run backend:setup

# Run migrations
npm run migrate

# Start backend server (kayak npm run dev)
npm run backend
```

### Frontend Development
```bash
# Install dependencies
npm run frontend:install

# Start dev server
npm run frontend
```

📖 **Dokumentasi lengkap**: [DEV_GUIDE.md](../DEV_GUIDE.md)

---

## 🎯 Script Utama (Yang Sering Dipakai)

### Backend (API + Worker)

```bash
# Start backend (API + Worker + Infrastructure)
scripts\backend-start.bat

# Restart backend
scripts\backend-restart.bat

# Stop backend
scripts\backend-stop.bat
```

**Kapan pakai:**
- Setiap kali mau mulai development backend
- Setelah ubah code Python di API atau Worker
- Kalau API error atau tidak respond

### Frontend (React)

```bash
# Start frontend
scripts\frontend-start.bat

# Restart frontend (dengan clean cache)
scripts\frontend-restart.bat
```

**Kapan pakai:**
- Setiap kali mau mulai development frontend
- Kalau UI tidak update setelah ubah code
- Kalau ada error di browser

### All Services (Backend + Frontend)

```bash
# Start semua service
scripts\start-dev.bat

# Restart semua service
scripts\restart-all.bat

# Stop semua service
scripts\stop-dev.bat
```

**Kapan pakai:**
- First time setup
- Mau jalankan full stack sekaligus
- Kalau banyak service yang error

---

## 📋 Script Lainnya

### Setup & User Management

```bash
# Initial setup (first time only)
scripts\setup-dev.bat

# Create default admin user
cd apps\api
python ..\scripts\create_default_user.py

# Create custom user
cd apps\api
python ..\scripts\create_user.py

# Test login
cd apps\api
python ..\scripts\test_login.py
```

### Troubleshooting

```bash
# Fix web access issues (reports/analytics tidak bisa diakses)
scripts\fix-web-access.bat

# Restart API only
scripts\restart-api.bat
```

---

## 🚀 Workflow Sehari-hari

### Scenario 1: Mulai Development (Pagi)

```bash
# Option A: Start backend saja (kalau cuma kerja di backend)
scripts\backend-start.bat

# Option B: Start frontend saja (kalau cuma kerja di frontend)
scripts\frontend-start.bat

# Option C: Start semua (kalau kerja full stack)
scripts\start-dev.bat
```

### Scenario 2: Ubah Code Backend

```bash
# Tidak perlu restart! Uvicorn auto-reload sudah aktif
# Tapi kalau error atau tidak respond:
scripts\backend-restart.bat
```

### Scenario 3: Ubah Code Frontend

```bash
# Tidak perlu restart! Vite HMR sudah aktif
# Tapi kalau UI tidak update atau error:
scripts\frontend-restart.bat
```

### Scenario 4: Ubah Code Worker

```bash
# Worker PERLU restart manual
# Close window "Sijadin Worker" dan jalankan:
scripts\backend-restart.bat
```

### Scenario 5: Selesai Development (Malam)

```bash
# Stop semua service
scripts\stop-dev.bat

# Atau cukup close semua terminal window
```

---

## 🔍 Troubleshooting

### Backend tidak bisa start

```bash
# Check apakah virtual environment sudah dibuat
cd apps\api
dir venv

# Kalau belum ada, buat dulu:
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt

# Lalu start lagi:
cd ..\..
scripts\backend-start.bat
```

### Frontend tidak bisa start

```bash
# Check apakah node_modules sudah ada
cd apps\web
dir node_modules

# Kalau belum ada, install dulu:
npm install

# Lalu start lagi:
cd ..\..
scripts\frontend-start.bat
```

### Port sudah dipakai

```bash
# Check process yang pakai port 8000 (API)
netstat -ano | findstr :8000

# Kill process
taskkill /F /PID <PID>

# Check process yang pakai port 5173 (Frontend)
netstat -ano | findstr :5173

# Kill process
taskkill /F /PID <PID>
```

### Database error

```bash
# Restart PostgreSQL
docker-compose restart postgres

# Check status
docker-compose ps postgres

# View logs
docker-compose logs postgres
```

---

## 📝 Daftar Lengkap Script

| Script | Fungsi | Kapan Pakai |
|--------|--------|-------------|
| `backend-start.bat` | Start backend (API + Worker) | Setiap mulai dev backend |
| `backend-restart.bat` | Restart backend | Setelah ubah code backend |
| `backend-stop.bat` | Stop backend | Selesai development |
| `frontend-start.bat` | Start frontend | Setiap mulai dev frontend |
| `frontend-restart.bat` | Restart frontend + clean cache | UI tidak update |
| `start-dev.bat` | Start semua service | First time atau full stack |
| `restart-all.bat` | Restart semua service | Banyak error |
| `stop-dev.bat` | Stop semua service | Selesai development |
| `setup-dev.bat` | Initial setup | First time only |
| `fix-web-access.bat` | Fix web access issues | Reports/analytics error |
| `restart-api.bat` | Restart API only | API error |
| `create_default_user.py` | Create admin user | First time setup |
| `create_user.py` | Create custom user | Butuh user baru |
| `test_login.py` | Test login | Verify authentication |

---

## 💡 Tips

1. **Backend auto-reload sudah aktif**, tidak perlu restart setiap ubah code Python
2. **Frontend HMR sudah aktif**, tidak perlu restart setiap ubah code React
3. **Worker perlu restart manual** setelah ubah code
4. Gunakan `backend-restart.bat` kalau backend error atau tidak respond
5. Gunakan `frontend-restart.bat` kalau UI tidak update atau ada error
6. Kalau bingung, pakai `restart-all.bat` untuk restart semua

---

## 🎓 Rekomendasi

**Untuk development sehari-hari:**

1. **Pagi**: Jalankan `backend-start.bat` dan `frontend-start.bat` di terminal terpisah
2. **Development**: Edit code, auto-reload akan handle restart
3. **Kalau error**: Restart service yang bermasalah saja
4. **Malam**: Close terminal atau jalankan `stop-dev.bat`

**Keuntungan:**
- Lebih cepat karena tidak restart semua service
- Lebih mudah debug karena log terpisah
- Lebih hemat resource

---

**Need help?** Check [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) atau [QUICK_REFERENCE.md](../QUICK_REFERENCE.md)
