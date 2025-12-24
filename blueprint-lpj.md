# Blueprint Sijadin
## Web App Pembuat Laporan Perjalanan Dinas (AI-assisted)

> Target: MVP cepat, arsitektur rapi, siap di-codegen.
> Catatan: Semua komponen aplikasi & storage **lokal**. LLM dapat memakai **provider eksternal** (Chutes AI / Gemini).

---

## 1. Tujuan Produk
Aplikasi web untuk membuat laporan perjalanan dinas secara semi-otomatis:
1) User membuat *Report* baru dan mengunggah bahan (KAK, susunan acara, tiket, undangan, daftar hadir, foto dokumentasi).
2) Sistem menjalankan pipeline ekstraksi + analisis AI.
3) Sistem menyusun *draft laporan* sesuai struktur standar instansi.
4) User review & edit melalui editor web.
5) Setelah final, user export ke **DOCX** dan **PDF** dengan format instansi (template).

---

## 2. Prinsip Desain
- **Format dokumen dikunci oleh template DOCX** (source-of-truth). LLM mengisi **konten terstruktur**, bukan layout.
- Proses berat (parsing/OCR/LLM) berjalan di **job queue** (async), bukan request HTTP.
- File biner disimpan di **local storage** (filesystem atau MinIO lokal). DB hanya metadata.
- Draft disimpan sebagai **structured sections (JSON)** + versi untuk audit/rollback.
- Pipeline mendukung fallback:
  - PDF text-based → ekstraksi library
  - Scan/foto → vision LLM (atau OCR fallback)

---

## 3. Tech Stack (MVP Final)

### 3.1 Frontend
- React + Vite
- TypeScript
- TailwindCSS
- Editor: **Tiptap**
- HTTP client: fetch/axios
- State: TanStack Query (opsional, direkomendasikan)
- Upload: simple multipart (MVP) → upgrade ke presigned (MinIO) jika perlu

### 3.2 Backend
- FastAPI (Python)
- Pydantic models (schema/validation)
- Auth: JWT (password hash bcrypt/argon2)
- LLM Orchestration: LangChain (atau LangGraph jika workflow kompleks)

### 3.3 Async Jobs
- Redis
- Worker queue: **RQ** (simple) *atau* Celery

### 3.4 Database
- PostgreSQL
- Ekstensi: **pgvector** (untuk RAG/embedding)

### 3.5 File Storage (lokal)
- **MinIO lokal** (S3-compatible) sebagai object storage
  - Bucket rekomendasi: `uploads`, `exports`, `artifacts`
  - Upload via API (MVP) → upgrade ke presigned URL jika diperlukan

### 3.6 Parsing & Export
- PDF: PyMuPDF (fitz) atau pdfplumber
- DOCX: python-docx (parsing ringan)
- OCR fallback: Tesseract (opsional)
- DOCX templating: **docxtpl**
- PDF export: **HTML → PDF** via **Playwright/Chromium** (server-side)
  - Sumber HTML berasal dari draft canonical JSON (render template HTML)

### 3.7 LLM Provider (remote)
- Provider abstraction: `LLMProvider`
  - Chutes AI (text models)
  - Gemini (multimodal) untuk scan/image/doc understanding

---

## 4. Arsitektur Tingkat Tinggi

### 4.1 Komponen
- `web` — Frontend (Vite)
- `api` — FastAPI (REST)
- `worker` — RQ worker (pipeline)
- `postgres` — metadata + drafts
- `redis` — queue
- `storage` — filesystem atau MinIO
- (opsional) `ollama` — jika suatu saat ingin LLM lokal

### 4.2 Data Flow
1) User create report → `POST /reports`
2) Upload files → `POST /reports/{id}/files`
3) Trigger processing job → `POST /reports/{id}/process`
4) Worker pipeline:
   - classify files
   - extract text/vision
   - build facts JSON
   - (optional) embed & index
   - generate draft sections JSON
   - save draft version
5) UI polling job status → `GET /jobs/{id}`
6) User edit draft → `PATCH /reports/{id}/draft`
7) Export:
   - `POST /reports/{id}/export?format=docx|pdf`

---

## 5. Domain Model & Data Entities

### 5.1 Entities
- **Organization**: instansi/unit
- **User**: auth + role
- **Report**: satu laporan perjalanan dinas
- **ReportFile**: file yang diupload (dokumen/foto)
- **ReportDraftVersion**: versi draft (JSON)
- **JobRun**: status pipeline
- **DocTemplate**: template DOCX + schema struktur

### 5.2 Struktur Draft (canonical)
Simpan draft sebagai JSON per section:
```json
{
  "template_id": "tpl-instansi-a-v1",
  "title": "Laporan Perjalanan Dinas ...",
  "meta": {
    "activity_name": "...",
    "location": "...",
    "date_start": "YYYY-MM-DD",
    "date_end": "YYYY-MM-DD",
    "unit": "...",
    "participants": ["..."]
  },
  "sections": [
    {
      "key": "pendahuluan",
      "title": "Pendahuluan",
      "content": "...",
      "citations": [{"file_id": "...", "page": 2}]
    },
    {
      "key": "pelaksanaan",
      "title": "Pelaksanaan Kegiatan",
      "subsections": [
        {"key": "waktu_tempat", "content": "..."},
        {"key": "agenda", "table": [{"jam": "...", "kegiatan": "..."}]}
      ]
    },
    {
      "key": "lampiran",
      "attachments": {
        "photos": [{"file_id": "...", "caption": "..."}],
        "tickets": [{"file_id": "...", "note": "..."}]
      }
    }
  ]
}
```

### 5.3 Editor Format
- UI menyimpan `tiptap_json` per section (opsional)
- Export menggunakan **draft canonical JSON** (bukan HTML editor) agar format Word konsisten

---

## 6. Template System (Format Instansi)

### 6.1 Konsep
- Format final mengikuti **Template DOCX** yang disiapkan instansi.
- Template memiliki placeholder dan loop (docxtpl).
- Schema struktur laporan disimpan sebagai `schema_json` (wajib section apa saja, urutan, field meta wajib).

### 6.2 Lokasi Setup (MVP)
- File:
  - `templates/instansi_a/template_v1.docx`
  - `templates/instansi_a/schema_v1.json`
- DB:
  - `doc_templates` menyimpan path + schema + version

### 6.3 docxtpl Placeholder (contoh)
- `{{ meta.activity_name }}`
- loop agenda:
  - `{% for row in agenda %} ... {% endfor %}`
- loop foto lampiran:
  - `{% for p in photos %}` insert image + caption `{% endfor %}`

---

## 7. Parsing & AI Pipeline

### 7.1 File Classification
Tujuan: mengelompokkan file ke kategori:
- KAK / TOR
- Susunan acara / agenda
- Tiket (kereta/pesawat)
- Undangan
- Daftar peserta/daftar hadir
- Foto dokumentasi

Metode MVP:
- heuristik sederhana (nama file + mime + keyword dari teks awal)
- fallback LLM untuk klasifikasi jika ambigu

### 7.2 Extraction Strategy
- PDF text-based → extract text via PyMuPDF
- DOCX → read text via python-docx
- Image/scan → vision LLM (Gemini multimodal) untuk:
  - OCR + layout understanding
  - captioning foto dokumentasi
- OCR fallback (opsional) → Tesseract

### 7.3 Facts Builder
Normalisasi semua hasil ekstraksi ke `facts.json`:
- tanggal, lokasi, unit, peserta, tujuan
- agenda (array)
- ringkasan kegiatan
- daftar lampiran (foto/tiket)

### 7.4 RAG / Embedding (dipakai di MVP)
- Chunk extracted text
- Generate embedding
- Simpan ke **pgvector**
- Retrieval per section saat generate draft untuk grounding

## 7.5 Draft Generator
Input:
- template schema
- facts.json
- retrieval snippets (opsional)

Output:
- canonical draft JSON (section-by-section)

### 7.6 Guardrails
- Validasi Pydantic/JSON Schema (field wajib ada)
- Limit panjang per section
- Optional: minta LLM memberi *citation anchors* (file + page)

---

## 8. API Design (MVP)

### 8.1 Auth
- `POST /auth/register` (opsional)
- `POST /auth/login` → JWT
- `GET /auth/me`

### 8.2 Reports
- `POST /reports` create report
- `GET /reports` list
- `GET /reports/{id}` detail
- `PATCH /reports/{id}` update meta

### 8.3 Files
- `POST /reports/{id}/files` upload (multipart)
- `GET /reports/{id}/files` list
- `GET /files/{file_id}/download`

### 8.4 Processing Jobs
- `POST /reports/{id}/process` start job
- `GET /jobs/{job_id}` status + progress

### 8.5 Draft
- `GET /reports/{id}/draft` get current
- `PATCH /reports/{id}/draft` update sections
- `GET /reports/{id}/draft/versions` list
- `POST /reports/{id}/draft/restore?version_id=...` (opsional)

### 8.6 Export
- `POST /reports/{id}/export?format=docx|pdf`
- `GET /exports/{export_id}/download`

---

## 9. Database Schema (Minimal)

### 9.1 Tables
- `users(id, email, password_hash, role, created_at)`
- `organizations(id, name)`
- `doc_templates(id, org_id, name, version, docx_path, schema_json, is_active, created_at)`
- `reports(id, org_id, template_id, title, status, created_by, created_at, updated_at)`
- `report_files(id, report_id, kind, filename, mime, size, storage_key, created_at)`
- `report_draft_versions(id, report_id, version_no, draft_json, created_by, created_at)`
- `job_runs(id, report_id, status, progress, started_at, finished_at, error_json)`
- `exports(id, report_id, format, storage_key, created_at)`

### 9.2 Enum / Status
- `reports.status`: `drafting | processing | ready_to_review | finalized | exported`
- `job_runs.status`: `queued | running | success | failed`

---

## 10. Folder Structure (Monorepo)
```
repo/
  apps/
    web/                # Vite React
    api/                # FastAPI
    worker/             # RQ worker
  packages/
    shared/             # shared types (optional)
  templates/
    instansi_a/
      template_v1.docx
      schema_v1.json
  data/                 # local storage (dev)
    uploads/
    exports/
  docker-compose.yml
  .env.example
```

---

## 11. Docker Compose (MVP Services)
- postgres (pgvector enabled)
- redis
- minio
- api
- worker
- web

> Catatan: untuk MVP, upload bisa lewat API dulu. Jika file besar/banyak, upgrade ke **presigned URL MinIO** agar lebih efisien.

---

## 12. MVP UI Pages

### 12.1 Auth
- Login page

### 12.2 Report List
- list laporan
- tombol create

### 12.3 Report Detail
- metadata (judul, tanggal, lokasi, unit)
- upload area + daftar file
- tombol `Process`
- status job + progress

### 12.4 Draft Editor
- side navigation per section (schema)
- editor Tiptap per section
- panel “citations/sumber” (opsional)
- tombol save

### 12.5 Export
- preview info
- tombol download DOCX/PDF

---

## 13. Milestones Implementasi (Praktis)

### Milestone 1 — Skeleton
- Auth + CRUD report
- Upload files (filesystem)

### Milestone 2 — Async Pipeline
- Redis + RQ
- Job status polling
- Extract text basic (PDF/DOCX)

### Milestone 3 — AI Draft
- Provider abstraction (Chutes/Gemini)
- Draft JSON per schema

### Milestone 4 — Editor & Versioning
- Tiptap editor per section
- Save draft versions

### Milestone 5 — Export
- docxtpl render DOCX
- LibreOffice convert PDF

---

## 14. Non-Functional Requirements (MVP)
- Max file size per upload (config)
- Antivirus scanning (optional; bisa ditunda)
- Audit minimal: log job runs + siapa edit versi
- Redaction sebelum kirim ke LLM provider (regex NIK/nomor tiket, opsional)

---

## 15. Keputusan MVP (sudah dipilih)
1) **Storage:** MinIO lokal
2) **RAG / Vector store:** PostgreSQL + **pgvector**
3) **PDF export:** **HTML → PDF** menggunakan Playwright/Chromium (server-side)
4) **Template instansi:** DOCX template + schema JSON (versioned)

---

## 16. Definition of Done (MVP)
- User dapat upload bahan + foto
- Sistem menghasilkan draft terstruktur sesuai template schema
- User dapat edit dan tersimpan
- User dapat export DOCX dan PDF sesuai format instansi

---

### Lampiran A — Kontrak Provider LLM (interface)
```text
LLMProvider
  - generate_text(prompt, context) -> text/json
  - analyze_document(file|text, instructions) -> json
  - caption_images(images, instructions) -> [{caption, metadata}]
```

### Lampiran B — Job Steps (pipeline)
1) `classify_files`
2) `extract_text`
3) `build_facts`
4) (optional) `embed_index`
5) `generate_draft`
6) `persist_version`

---

> Blueprint ini sengaja dibuat deterministik: format dokumen dikontrol template + schema, AI mengisi konten terstruktur.

