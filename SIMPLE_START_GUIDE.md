# 🚀 Panduan Simpel - Cara Jalankan Sijadin

## Untuk Backend Developer

### Pertama Kali (Setup)
```bash
# 1. Setup environment
scripts\setup-dev.bat

# 2. Create admin user
cd apps\api
python ..\scripts\create_default_user.py
cd ..\..
```

### Setiap Hari (Development)

**Mulai kerja:**
```bash
scripts\backend-start.bat
```
✅ Ini akan start:
- PostgreSQL (database)
- Redis (job queue)
- MinIO (file storage)
- API Server (FastAPI)
- Worker (Celery)

**Selesai kerja:**
```bash
scripts\backend-stop.bat
```
atau cukup close terminal window

**Kalau backend error:**
```bash
scripts\backend-restart.bat
```

### Catatan Penting
- ✅ **Auto-reload aktif** - Tidak perlu restart setiap ubah code Python
- ⚠️ **Worker perlu restart** - Kalau ubah code worker, restart backend
- 🔍 **Check logs** - Lihat terminal untuk error messages

---

## Untuk Frontend Developer

### Pertama Kali (Setup)
```bash
cd apps\web
npm install
cd ..\..
```

### Setiap Hari (Development)

**Mulai kerja:**
```bash
scripts\frontend-start.bat
```
✅ Ini akan start Vite dev server di http://localhost:5173

**Selesai kerja:**
Cukup close terminal atau tekan Ctrl+C

**Kalau UI tidak update atau error:**
```bash
scripts\frontend-restart.bat
```

### Catatan Penting
- ✅ **HMR aktif** - UI auto-update setiap ubah code
- 🧹 **Clean cache** - Gunakan restart kalau UI tidak update
- 🔍 **Check console** - Buka browser DevTools (F12) untuk error

---

## Untuk Full Stack Developer

### Pertama Kali (Setup)
```bash
scripts\setup-dev.bat
```

### Setiap Hari (Development)

**Mulai kerja:**
```bash
scripts\start-dev.bat
```
✅ Ini akan start semua service (backend + frontend)

**Selesai kerja:**
```bash
scripts\stop-dev.bat
```

**Kalau ada error:**
```bash
scripts\restart-all.bat
```

---

## 🎯 Workflow Recommended

### Option 1: Terpisah (Recommended)
Lebih mudah debug karena log terpisah:

**Terminal 1 (Backend):**
```bash
scripts\backend-start.bat
```

**Terminal 2 (Frontend):**
```bash
scripts\frontend-start.bat
```

### Option 2: Sekaligus
Lebih cepat tapi log jadi satu:

**Terminal 1:**
```bash
scripts\start-dev.bat
```

---

## 🐛 Troubleshooting Cepat

### Backend tidak bisa start
```bash
# Check virtual environment
cd apps\api
dir venv

# Kalau tidak ada:
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend tidak bisa start
```bash
# Check node_modules
cd apps\web
dir node_modules

# Kalau tidak ada:
npm install
```

### Reports/Analytics tidak bisa diakses
```bash
scripts\fix-web-access.bat
```

### Port sudah dipakai
```bash
# API (port 8000)
netstat -ano | findstr :8000
taskkill /F /PID <PID>

# Frontend (port 5173)
netstat -ano | findstr :5173
taskkill /F /PID <PID>
```

### Database error
```bash
docker-compose restart postgres
```

---

## 📍 Access Points

Setelah start, akses di:

- **Frontend**: http://localhost:5173
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **MinIO Console**: http://localhost:9001

**Login:**
- Email: `admin@sijadin.local`
- Password: `admin123`

---

## 💡 Tips

1. **Backend auto-reload** - Tidak perlu restart setiap ubah code
2. **Frontend HMR** - UI auto-update setiap ubah code
3. **Gunakan 2 terminal** - Satu untuk backend, satu untuk frontend
4. **Check logs** - Selalu lihat terminal untuk error
5. **Browser DevTools** - Tekan F12 untuk debug frontend

---

## 📚 Dokumentasi Lengkap

- [scripts/README.md](./scripts/README.md) - Penjelasan semua script
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick reference
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Troubleshooting guide
- [README.md](./README.md) - Full documentation

---

**Masih bingung?** Baca [scripts/README.md](./scripts/README.md) untuk penjelasan detail!
