# Phase 16-18 Quick Start Guide

Panduan cepat untuk menggunakan fitur Draft Editor, Export, dan Testing yang baru selesai diimplementasikan.

---

## 🎯 Fitur Baru

### Phase 16: Draft Editor
- ✅ Rich text editor dengan Tiptap
- ✅ Navigasi section berbasis schema
- ✅ Auto-save dengan version history
- ✅ Panel citations untuk referensi

### Phase 17: Export
- ✅ Export ke DOCX
- ✅ Export ke PDF
- ✅ History export dengan download

### Phase 18: Testing
- ✅ Unit tests untuk semua endpoint
- ✅ Integration tests end-to-end
- ✅ Test coverage reporting

---

## 🚀 Quick Start

### 1. Menggunakan Draft Editor

#### Akses Editor
1. Buka report detail: `/reports/{id}`
2. Klik tombol **"Edit Draft"** (hanya muncul jika status `ready_to_review`)
3. Editor akan terbuka dengan layout 3 kolom

#### Navigasi Section
- **Kolom kiri**: Daftar section dari template
- **Kolom tengah**: Editor Tiptap
- **Kolom kanan**: Citations & info

#### Editing Content
1. Pilih section dari navigasi kiri
2. Edit konten dengan toolbar:
   - **Bold** (Ctrl+B)
   - **Italic** (Ctrl+I)
   - **Heading 1, 2**
   - **Bullet List**
   - **Numbered List**
   - **Blockquote**
3. Perubahan otomatis terdeteksi (muncul indikator "Unsaved changes")
4. Klik **"Save Draft"** untuk menyimpan

#### Version History
1. Klik tombol **"History"** di header
2. Lihat semua versi draft
3. Klik **"Restore"** untuk kembali ke versi sebelumnya

---

### 2. Export Report

#### Akses Export
1. Dari report detail, klik **"Export Options"**
2. Atau dari draft editor, klik **"Export Options"** di panel kanan

#### Export DOCX
1. Klik card **"Microsoft Word"**
2. File akan diproses dan otomatis download
3. Format mengikuti template instansi

#### Export PDF
1. Klik card **"PDF Document"**
2. File akan diproses dan otomatis download
3. Format print-ready dengan styling preserved

#### Download Export Lama
1. Scroll ke section **"Recent Exports"**
2. Klik tombol **"Download"** pada export yang diinginkan

---

### 3. Running Tests

#### Test Semua Endpoint
```bash
# Via script
scripts\run-tests.bat

# Via command line
cd apps/api
pytest -v
```

#### Test dengan Coverage
```bash
# Via script
scripts\run-tests-coverage.bat

# Via command line
cd apps/api
pytest -v --cov=app --cov-report=html
```

#### Test Specific File
```bash
cd apps/api
pytest tests/test_integration.py -v
```

---

## 📁 File Structure

### Frontend Components
```
apps/web/src/
├── pages/
│   ├── DraftEditor.tsx          # Main editor page
│   ├── VersionHistory.tsx       # Version history viewer
│   └── ExportPage.tsx           # Export interface
└── components/
    └── editor/
        ├── TiptapEditor.tsx     # Rich text editor
        ├── SectionNav.tsx       # Section navigation
        └── CitationPanel.tsx    # Citations display
```

### Backend Tests
```
apps/api/tests/
├── conftest.py                  # Test fixtures
├── test_auth.py                 # Auth tests
├── test_reports.py              # Report CRUD tests
├── test_files.py                # File upload tests
├── test_draft.py                # Draft management tests
├── test_export.py               # Export tests
└── test_integration.py          # End-to-end tests
```

---

## 🎨 UI Features

### Draft Editor
- **Smooth animations** dengan Framer Motion
- **Auto-save indicator** untuk perubahan belum tersimpan
- **Progress tracker** menampilkan section yang sudah selesai
- **Responsive layout** untuk berbagai ukuran layar

### Section Navigation
- **Visual indicators** untuk section aktif dan selesai
- **Smooth transitions** saat berpindah section
- **Numbered sections** untuk navigasi mudah

### Tiptap Editor
- **Toolbar** dengan formatting options
- **Bubble menu** untuk quick formatting
- **Placeholder text** untuk section kosong
- **Custom styling** dengan design system

### Citations Panel
- **File icons** berdasarkan tipe
- **Page numbers** untuk referensi
- **Hover effects** untuk interaktivitas

---

## 🔧 API Endpoints

### Draft Management
```
GET    /api/v1/reports/{id}/draft              # Get current draft
PATCH  /api/v1/reports/{id}/draft              # Update draft
GET    /api/v1/reports/{id}/draft/versions     # List versions
POST   /api/v1/reports/{id}/draft/restore      # Restore version
```

### Export
```
POST   /api/v1/reports/{id}/export?format=docx|pdf  # Create export
GET    /api/v1/reports/{id}/exports                 # List exports
GET    /api/v1/exports/{id}/download                # Download export
```

---

## 🧪 Test Examples

### Test Authentication
```python
def test_login_user(client, test_user):
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "test@example.com",
            "password": "testpass123"
        }
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
```

### Test Draft Update
```python
def test_update_draft(client, auth_headers, test_report):
    draft_data = {
        "template_id": "tpl-test-v1",
        "title": "Test Draft",
        "sections": [...]
    }
    response = client.patch(
        f"/api/v1/reports/{test_report['id']}/draft",
        json=draft_data,
        headers=auth_headers
    )
    assert response.status_code == 200
```

### Test Full Workflow
```python
def test_full_workflow(client, auth_headers):
    # 1. Create report
    # 2. Upload files
    # 3. Process
    # 4. Update draft
    # 5. Export
    # See test_integration.py for full example
```

---

## 💡 Tips & Tricks

### Editor Tips
1. **Keyboard shortcuts**: Gunakan Ctrl+B, Ctrl+I untuk formatting cepat
2. **Bubble menu**: Select text untuk quick formatting
3. **Auto-save**: Tunggu indikator "Unsaved changes" hilang sebelum keluar
4. **Version history**: Gunakan untuk rollback jika ada kesalahan

### Testing Tips
1. **Run specific tests**: `pytest tests/test_auth.py::test_login_user -v`
2. **Show print output**: `pytest -s`
3. **Stop on first failure**: `pytest -x`
4. **Coverage report**: Buka `htmlcov/index.html` setelah run coverage

### Performance Tips
1. **Draft saves**: Debounced untuk menghindari terlalu banyak request
2. **React Query caching**: Data di-cache untuk mengurangi fetch
3. **Optimistic updates**: UI update langsung sebelum API response

---

## 🐛 Troubleshooting

### Editor tidak muncul
- Pastikan report status adalah `ready_to_review`
- Check console untuk error
- Verify draft endpoint returns data

### Save tidak berhasil
- Check network tab untuk error response
- Verify auth token masih valid
- Check draft data structure sesuai schema

### Export gagal
- Pastikan draft sudah ada
- Check template tersedia
- Verify MinIO/storage accessible

### Test gagal
- Install dependencies: `pip install -r requirements-test.txt`
- Check database setup di conftest.py
- Verify fixtures working correctly

---

## 📚 Documentation

- **Full Testing Guide**: `TESTING_GUIDE.md`
- **Phase Completion**: `PHASE_16_17_18_COMPLETED.md`
- **API Documentation**: Check FastAPI `/docs` endpoint
- **Component Docs**: See inline comments in source files

---

## ✅ Checklist

### Before Using Editor
- [ ] Report created
- [ ] Files uploaded
- [ ] Processing completed
- [ ] Report status = `ready_to_review`

### Before Export
- [ ] Draft created and saved
- [ ] All required sections filled
- [ ] Citations verified
- [ ] Template selected

### Before Running Tests
- [ ] Dependencies installed
- [ ] Virtual environment activated
- [ ] Database accessible
- [ ] Environment variables set

---

## 🎉 What's Next?

Phase 19: Deployment & DevOps
- [ ] Create Dockerfiles
- [ ] Production docker-compose
- [ ] Health check endpoints
- [ ] Deployment documentation
- [ ] CI/CD setup

---

**Status**: Phase 16-18 Complete ✅  
**Date**: December 27, 2024  
**Ready for**: Phase 19 (Deployment)
