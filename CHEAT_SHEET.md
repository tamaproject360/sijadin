# Sijadin - Development Cheat Sheet

## 🎯 Cara Jalanin Backend (Semudah npm run dev)

### Pertama Kali (Setup)
```bash
npm run backend:setup    # Setup Python environment & Docker
npm run migrate          # Run database migrations
```

### Setiap Hari (Development)
```bash
# Terminal 1
npm run backend          # Start backend di http://localhost:8000

# Terminal 2  
npm run frontend         # Start frontend di http://localhost:5173
```

That's it! 🎉

---

## 📝 All Available Commands

| Command | Fungsi |
|---------|--------|
| `npm run backend` | Start backend server |
| `npm run backend:setup` | Setup backend (pertama kali) |
| `npm run migrate` | Run database migrations |
| `npm run frontend` | Start frontend server |
| `npm run frontend:install` | Install frontend dependencies |
| `npm run docker:up` | Start Docker services |
| `npm run docker:down` | Stop Docker services |

---

## 🔗 URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **MinIO Console**: http://localhost:9001 (minioadmin / minioadmin123)

---

## 🐛 Quick Fixes

### Backend gak bisa start?
```bash
docker-compose down
docker-compose up -d postgres redis minio
npm run backend
```

### Database error?
```bash
npm run migrate
```

### Port sudah dipakai?
- Kill process di port 8000 (backend) atau 5173 (frontend)
- Atau ubah port di config

---

## 📚 Dokumentasi Lengkap

- **Development Guide**: [DEV_GUIDE.md](DEV_GUIDE.md)
- **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Scripts**: [scripts/README.md](scripts/README.md)
