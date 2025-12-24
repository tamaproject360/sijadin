# Troubleshooting Guide

## Masalah: Tidak Bisa Akses Halaman Reports Setelah Login

### Gejala
- Login berhasil
- Redirect ke dashboard berhasil
- Tapi saat akses `/reports` muncul error di console browser
- Error: "The above error occurred in the <Reports> component"

### Penyebab Umum

1. **File .env tidak ada di folder web**
   - Frontend tidak tahu URL API yang benar
   - Request ke API gagal

2. **Cache browser atau Vite corrupt**
   - Build artifacts lama masih di-cache
   - Module loading gagal

3. **API response format tidak sesuai**
   - Frontend expect array langsung
   - API return object dengan struktur berbeda

### Solusi

#### Solusi Cepat (Recommended)
Jalankan script otomatis:
```bash
scripts\fix-web-access.bat
```

Script ini akan:
1. Check apakah API running
2. Stop web dev server yang lama
3. Clean cache Vite
4. Buat/check file .env
5. Start web dev server baru

#### Solusi Manual

**1. Pastikan API Running**
```bash
# Check API health
curl http://localhost:8000/api/v1/health

# Jika tidak running, start API
scripts\start-api.bat
```

**2. Buat File .env di Web App**
```bash
cd apps\web
echo VITE_API_URL=http://localhost:8000/api/v1 > .env
```

**3. Clean Cache dan Restart**
```bash
cd apps\web

# Hapus cache
rmdir /s /q node_modules\.vite
rmdir /s /q dist

# Restart dev server
npm run dev
```

**4. Clear Browser Cache**
- Chrome/Edge: Ctrl+Shift+Delete
- Pilih "Cached images and files"
- Clear data
- Atau gunakan Incognito/Private mode

---

## Masalah: Tidak Bisa Akses Halaman Analytics

### Gejala
- Login berhasil
- Dashboard dan Reports bisa diakses
- Tapi saat akses `/analytics` muncul error
- Error: "No routes matched location '/analytics'"

### Penyebab
- Route analytics belum terdaftar di routing
- API endpoint analytics belum ada
- API server perlu direstart untuk load endpoint baru

### Solusi

#### Solusi Cepat (Recommended)
Jalankan script untuk restart semua service:
```bash
scripts\restart-all.bat
```

#### Solusi Manual

**1. Restart API Server**
```bash
# Stop API
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *Sijadin API*"

# Start API
cd apps\api
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**2. Restart Web Server**
```bash
# Stop Web
taskkill /F /IM node.exe /FI "WINDOWTITLE eq *Sijadin Web*"

# Clean cache
cd apps\web
rmdir /s /q node_modules\.vite

# Start Web
npm run dev
```

**3. Verify Endpoints**
Buka browser dan akses:
- API Docs: http://localhost:8000/docs
- Check apakah endpoint `/api/v1/analytics` ada di list
- Test endpoint langsung di Swagger UI

---

## Masalah: Tidak Bisa Akses Halaman Reports Setelah Login

### Gejala
- Login berhasil
- Redirect ke dashboard berhasil
- Tapi saat akses `/reports` muncul error di console browser
- Error: "The above error occurred in the <Reports> component"

### Penyebab Umum

1. **File .env tidak ada di folder web**
   - Frontend tidak tahu URL API yang benar
   - Request ke API gagal

2. **Cache browser atau Vite corrupt**
   - Build artifacts lama masih di-cache
   - Module loading gagal

3. **API response format tidak sesuai**
   - Frontend expect array langsung
   - API return object dengan struktur berbeda

### Solusi

#### Solusi Cepat (Recommended)
Jalankan script otomatis:
```bash
scripts\fix-web-access.bat
```

Script ini akan:
1. Check apakah API running
2. Stop web dev server yang lama
3. Clean cache Vite
4. Buat/check file .env
5. Start web dev server baru

#### Solusi Manual

**1. Pastikan API Running**
```bash
# Check API health
curl http://localhost:8000/api/v1/health

# Jika tidak running, start API
scripts\start-api.bat
```

**2. Buat File .env di Web App**
```bash
cd apps\web
echo VITE_API_URL=http://localhost:8000/api/v1 > .env
```

**3. Clean Cache dan Restart**
```bash
cd apps\web

# Hapus cache
rmdir /s /q node_modules\.vite
rmdir /s /q dist

# Restart dev server
npm run dev
```

**4. Clear Browser Cache**
- Chrome/Edge: Ctrl+Shift+Delete
- Pilih "Cached images and files"
- Clear data
- Atau gunakan Incognito/Private mode

### Verifikasi

Setelah fix, cek:

1. **Browser Console** (F12)
   - Tidak ada error merah
   - Request ke `/api/v1/reports` berhasil (status 200)

2. **Network Tab**
   - Request ke `http://localhost:8000/api/v1/reports` ada
   - Response berisi data reports
   - Headers include Authorization token

3. **Application Tab**
   - localStorage ada key `token`
   - localStorage ada key `auth-storage`

### Masalah Lain

#### Error 401 Unauthorized
```
Penyebab: Token tidak valid atau expired
Solusi:
1. Logout dan login ulang
2. Check localStorage token
3. Pastikan JWT_SECRET_KEY sama di .env
```

#### Error 404 Not Found
```
Penyebab: API endpoint tidak ditemukan
Solusi:
1. Check API URL di .env: VITE_API_URL
2. Pastikan API running di port 8000
3. Check router configuration di API
```

#### Error CORS
```
Penyebag: CORS policy blocking request
Solusi:
1. Check CORS_ORIGINS di .env root
2. Pastikan include http://localhost:5173
3. Restart API setelah ubah .env
```

#### Blank Page / White Screen
```
Penyebab: JavaScript error atau build issue
Solusi:
1. Check browser console untuk error
2. Clean cache: rmdir /s /q node_modules\.vite
3. Reinstall dependencies: npm install
4. Restart dev server
```

### Tips Debugging

1. **Gunakan Browser DevTools**
   - Console: lihat error JavaScript
   - Network: lihat request/response API
   - Application: lihat localStorage/sessionStorage

2. **Check API Logs**
   - Lihat terminal yang running API
   - Check error atau warning messages

3. **Test API Langsung**
   ```bash
   # Get token
   curl -X POST http://localhost:8000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
   
   # Test reports endpoint
   curl http://localhost:8000/api/v1/reports \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

4. **Check Dependencies**
   ```bash
   cd apps\web
   npm list @tanstack/react-query
   npm list react-router-dom
   npm list axios
   ```

### Kontak Support

Jika masalah masih berlanjut:
1. Screenshot error di browser console
2. Copy error message lengkap
3. Check API logs
4. Dokumentasikan langkah yang sudah dicoba
