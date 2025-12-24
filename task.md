# Task List - Sijadin (Laporan Perjalanan Dinas)

> Disusun berdasarkan blueprint-lpj.md
> Status: ⬜ Pending | 🔄 In Progress | ✅ Done | ⏸️ Blocked

---

## Phase 0: Project Setup & Infrastructure

| No | Tugas | Status | Prioritas | Phase |
|----|-------|--------|-----------|-------|
| 0.1 | Setup monorepo structure (`apps/`, `packages/`, `templates/`, `data/`) | ⬜ | Critical | 0 |
| 0.2 | Buat `.env.example` dengan semua environment variables | ⬜ | Critical | 0 |
| 0.3 | Setup `docker-compose.yml` (postgres, redis, minio) | ⬜ | Critical | 0 |
| 0.4 | Konfigurasi PostgreSQL dengan ekstensi pgvector | ⬜ | Critical | 0 |
| 0.5 | Setup MinIO lokal + buat bucket (uploads, exports, artifacts) | ⬜ | Critical | 0 |
| 0.6 | Setup Redis untuk job queue | ⬜ | Critical | 0 |
| 0.7 | Buat README.md dengan instruksi setup development | ⬜ | Medium | 0 |

---

## Phase 1: Backend Foundation (FastAPI)

| No | Tugas | Status | Prioritas | Phase |
|----|-------|--------|-----------|-------|
| 1.1 | Init FastAPI project (`apps/api/`) | ⬜ | Critical | 1 |
| 1.2 | Setup Pydantic settings & config management | ⬜ | Critical | 1 |
| 1.3 | Setup database connection (SQLAlchemy/asyncpg) | ⬜ | Critical | 1 |
| 1.4 | Buat database migrations setup (Alembic) | ⬜ | Critical | 1 |
| 1.5 | Buat schema tabel `users` + migration | ⬜ | Critical | 1 |
| 1.6 | Buat schema tabel `organizations` + migration | ⬜ | Critical | 1 |
| 1.7 | Buat schema tabel `doc_templates` + migration | ⬜ | High | 1 |
| 1.8 | Buat schema tabel `reports` + migration | ⬜ | Critical | 1 |
| 1.9 | Buat schema tabel `report_files` + migration | ⬜ | Critical | 1 |
| 1.10 | Buat schema tabel `report_draft_versions` + migration | ⬜ | High | 1 |
| 1.11 | Buat schema tabel `job_runs` + migration | ⬜ | High | 1 |
| 1.12 | Buat schema tabel `exports` + migration | ⬜ | High | 1 |
| 1.13 | Setup MinIO client utility | ⬜ | High | 1 |

---

## Phase 2: Authentication & Authorization

| No | Tugas | Status | Prioritas | Phase |
|----|-------|--------|-----------|-------|
| 2.1 | Implementasi password hashing (bcrypt/argon2) | ⬜ | Critical | 2 |
| 2.2 | Implementasi JWT token generation & validation | ⬜ | Critical | 2 |
| 2.3 | Buat endpoint `POST /auth/register` | ⬜ | High | 2 |
| 2.4 | Buat endpoint `POST /auth/login` | ⬜ | Critical | 2 |
| 2.5 | Buat endpoint `GET /auth/me` | ⬜ | Critical | 2 |
| 2.6 | Buat auth middleware/dependency untuk protected routes | ⬜ | Critical | 2 |
| 2.7 | Buat role-based access control (RBAC) dasar | ⬜ | Medium | 2 |

---

## Phase 3: Core API - Reports & Files

| No | Tugas | Status | Prioritas | Phase |
|----|-------|--------|-----------|-------|
| 3.1 | Buat Pydantic schemas untuk Report | ⬜ | Critical | 3 |
| 3.2 | Buat endpoint `POST /reports` (create report) | ⬜ | Critical | 3 |
| 3.3 | Buat endpoint `GET /reports` (list reports) | ⬜ | Critical | 3 |
| 3.4 | Buat endpoint `GET /reports/{id}` (detail) | ⬜ | Critical | 3 |
| 3.5 | Buat endpoint `PATCH /reports/{id}` (update meta) | ⬜ | High | 3 |
| 3.6 | Buat Pydantic schemas untuk ReportFile | ⬜ | Critical | 3 |
| 3.7 | Buat endpoint `POST /reports/{id}/files` (upload multipart) | ⬜ | Critical | 3 |
| 3.8 | Implementasi upload file ke MinIO | ⬜ | Critical | 3 |
| 3.9 | Buat endpoint `GET /reports/{id}/files` (list files) | ⬜ | High | 3 |
| 3.10 | Buat endpoint `GET /files/{file_id}/download` | ⬜ | High | 3 |
| 3.11 | Validasi file size & mime type | ⬜ | High | 3 |

---

## Phase 4: Async Job Queue (RQ/Worker)

| No | Tugas | Status | Prioritas | Phase |
|----|-------|--------|-----------|-------|
| 4.1 | Setup RQ worker (`apps/worker/`) | ⬜ | Critical | 4 |
| 4.2 | Buat base job class dengan error handling | ⬜ | Critical | 4 |
| 4.3 | Buat endpoint `POST /reports/{id}/process` (trigger job) | ⬜ | Critical | 4 |
| 4.4 | Buat endpoint `GET /jobs/{job_id}` (status + progress) | ⬜ | Critical | 4 |
| 4.5 | Implementasi job progress tracking | ⬜ | High | 4 |
| 4.6 | Implementasi job error logging ke `job_runs` | ⬜ | High | 4 |

---

## Phase 5: Document Parsing & Extraction

| No | Tugas | Status | Prioritas | Phase |
|----|-------|--------|-----------|-------|
| 5.1 | Setup PyMuPDF untuk ekstraksi teks PDF | ⬜ | Critical | 5 |
| 5.2 | Setup python-docx untuk ekstraksi teks DOCX | ⬜ | Critical | 5 |
| 5.3 | Buat file classifier (heuristik: nama file + mime + keyword) | ⬜ | High | 5 |
| 5.4 | Implementasi job step `classify_files` | ⬜ | High | 5 |
| 5.5 | Implementasi job step `extract_text` | ⬜ | Critical | 5 |
| 5.6 | (Opsional) Setup Tesseract OCR fallback | ⬜ | Low | 5 |

---

## Phase 6: LLM Provider Abstraction

| No | Tugas | Status | Prioritas | Phase |
|----|-------|--------|-----------|-------|
| 6.1 | Buat interface `LLMProvider` (abstract class) | ⬜ | Critical | 6 |
| 6.2 | Implementasi provider Chutes AI | ⬜ | High | 6 |
| 6.3 | Implementasi provider Gemini (multimodal) | ⬜ | High | 6 |
| 6.4 | Buat method `generate_text(prompt, context)` | ⬜ | Critical | 6 |
| 6.5 | Buat method `analyze_document(file, instructions)` | ⬜ | High | 6 |
| 6.6 | Buat method `caption_images(images, instructions)` | ⬜ | High | 6 |
| 6.7 | Implementasi LLM fallback untuk klasifikasi file ambigu | ⬜ | Medium | 6 |
| 6.8 | (Opsional) Implementasi redaction sebelum kirim ke LLM | ⬜ | Low | 6 |

---

## Phase 7: RAG & Embedding (pgvector)

| No | Tugas | Status | Prioritas | Phase |
|----|-------|--------|-----------|-------|
| 7.1 | Setup embedding model (via LLM provider) | ⬜ | High | 7 |
| 7.2 | Buat text chunking utility | ⬜ | High | 7 |
| 7.3 | Buat tabel untuk menyimpan embeddings (pgvector) | ⬜ | High | 7 |
| 7.4 | Implementasi job step `embed_index` | ⬜ | High | 7 |
| 7.5 | Buat retrieval function untuk RAG | ⬜ | High | 7 |

---

## Phase 8: Facts Builder & Draft Generator

| No | Tugas | Status | Prioritas | Phase |
|----|-------|--------|-----------|-------|
| 8.1 | Definisikan schema `facts.json` (Pydantic) | ⬜ | Critical | 8 |
| 8.2 | Implementasi job step `build_facts` | ⬜ | Critical | 8 |
| 8.3 | Definisikan schema draft canonical JSON (Pydantic) | ⬜ | Critical | 8 |
| 8.4 | Implementasi job step `generate_draft` | ⬜ | Critical | 8 |
| 8.5 | Implementasi job step `persist_version` | ⬜ | Critical | 8 |
| 8.6 | Buat guardrails: validasi JSON Schema output | ⬜ | High | 8 |
| 8.7 | Buat guardrails: limit panjang per section | ⬜ | Medium | 8 |

---

## Phase 9: Draft API & Versioning

| No | Tugas | Status | Prioritas | Phase |
|----|-------|--------|-----------|-------|
| 9.1 | Buat endpoint `GET /reports/{id}/draft` | ⬜ | Critical | 9 |
| 9.2 | Buat endpoint `PATCH /reports/{id}/draft` (update sections) | ⬜ | Critical | 9 |
| 9.3 | Buat endpoint `GET /reports/{id}/draft/versions` | ⬜ | High | 9 |
| 9.4 | Buat endpoint `POST /reports/{id}/draft/restore` | ⬜ | Medium | 9 |
| 9.5 | Implementasi auto-versioning saat save draft | ⬜ | High | 9 |

---

## Phase 10: Template System

| No | Tugas | Status | Prioritas | Phase |
|----|-------|--------|-----------|-------|
| 10.1 | Buat folder `templates/instansi_a/` | ⬜ | Critical | 10 |
| 10.2 | Buat sample `template_v1.docx` dengan placeholder docxtpl | ⬜ | Critical | 10 |
| 10.3 | Buat `schema_v1.json` (struktur section wajib) | ⬜ | Critical | 10 |
| 10.4 | Buat API untuk list templates | ⬜ | High | 10 |
| 10.5 | Buat API untuk get template schema | ⬜ | High | 10 |

---

## Phase 11: Export (DOCX & PDF)

| No | Tugas | Status | Prioritas | Phase |
|----|-------|--------|-----------|-------|
| 11.1 | Setup docxtpl untuk render DOCX | ⬜ | Critical | 11 |
| 11.2 | Implementasi render draft JSON ke DOCX | ⬜ | Critical | 11 |
| 11.3 | Setup Playwright/Chromium untuk HTML→PDF | ⬜ | Critical | 11 |
| 11.4 | Buat HTML template untuk PDF rendering | ⬜ | High | 11 |
| 11.5 | Implementasi render draft JSON ke PDF | ⬜ | Critical | 11 |
| 11.6 | Buat endpoint `POST /reports/{id}/export?format=docx\|pdf` | ⬜ | Critical | 11 |
| 11.7 | Buat endpoint `GET /exports/{export_id}/download` | ⬜ | Critical | 11 |
| 11.8 | Simpan hasil export ke MinIO bucket `exports` | ⬜ | High | 11 |

---

## Phase 12: Frontend Foundation (React + Vite)

| No | Tugas | Status | Prioritas | Phase |
|----|-------|--------|-----------|-------|
| 12.1 | Init Vite + React + TypeScript (`apps/web/`) | ⬜ | Critical | 12 |
| 12.2 | Setup TailwindCSS | ⬜ | Critical | 12 |
| 12.3 | Setup routing (React Router) | ⬜ | Critical | 12 |
| 12.4 | Setup HTTP client (axios/fetch wrapper) | ⬜ | Critical | 12 |
| 12.5 | Setup TanStack Query untuk state management | ⬜ | High | 12 |
| 12.6 | Buat auth context & token storage | ⬜ | Critical | 12 |
| 12.7 | Buat protected route wrapper | ⬜ | Critical | 12 |
| 12.8 | Buat base UI components (Button, Input, Card, Modal) | ⬜ | High | 12 |

---

## Phase 13: Frontend - Auth Pages

| No | Tugas | Status | Prioritas | Phase |
|----|-------|--------|-----------|-------|
| 13.1 | Buat halaman Login | ⬜ | Critical | 13 |
| 13.2 | Integrasi login dengan API | ⬜ | Critical | 13 |
| 13.3 | (Opsional) Buat halaman Register | ⬜ | Low | 13 |
| 13.4 | Implementasi logout | ⬜ | High | 13 |

---

## Phase 14: Frontend - Report List & Create

| No | Tugas | Status | Prioritas | Phase |
|----|-------|--------|-----------|-------|
| 14.1 | Buat halaman Report List | ⬜ | Critical | 14 |
| 14.2 | Buat komponen Report Card | ⬜ | High | 14 |
| 14.3 | Buat modal/form Create Report | ⬜ | Critical | 14 |
| 14.4 | Integrasi list & create dengan API | ⬜ | Critical | 14 |
| 14.5 | Implementasi pagination/infinite scroll | ⬜ | Medium | 14 |

---

## Phase 15: Frontend - Report Detail & Upload

| No | Tugas | Status | Prioritas | Phase |
|----|-------|--------|-----------|-------|
| 15.1 | Buat halaman Report Detail | ⬜ | Critical | 15 |
| 15.2 | Buat komponen metadata display/edit | ⬜ | High | 15 |
| 15.3 | Buat komponen file upload (drag & drop) | ⬜ | Critical | 15 |
| 15.4 | Buat komponen file list dengan preview | ⬜ | High | 15 |
| 15.5 | Integrasi upload dengan API | ⬜ | Critical | 15 |
| 15.6 | Buat tombol "Process" + trigger job | ⬜ | Critical | 15 |
| 15.7 | Buat komponen job status + progress bar | ⬜ | Critical | 15 |
| 15.8 | Implementasi polling job status | ⬜ | Critical | 15 |

---

## Phase 16: Frontend - Draft Editor (Tiptap)

| No | Tugas | Status | Prioritas | Phase |
|----|-------|--------|-----------|-------|
| 16.1 | Setup Tiptap editor | ⬜ | Critical | 16 |
| 16.2 | Buat halaman Draft Editor | ⬜ | Critical | 16 |
| 16.3 | Buat side navigation per section (dari schema) | ⬜ | Critical | 16 |
| 16.4 | Buat editor per section dengan Tiptap | ⬜ | Critical | 16 |
| 16.5 | Integrasi load draft dari API | ⬜ | Critical | 16 |
| 16.6 | Implementasi save draft ke API | ⬜ | Critical | 16 |
| 16.7 | (Opsional) Buat panel citations/sumber | ⬜ | Low | 16 |
| 16.8 | (Opsional) Buat version history viewer | ⬜ | Low | 16 |

---

## Phase 17: Frontend - Export

| No | Tugas | Status | Prioritas | Phase |
|----|-------|--------|-----------|-------|
| 17.1 | Buat komponen Export panel/modal | ⬜ | Critical | 17 |
| 17.2 | Buat tombol download DOCX | ⬜ | Critical | 17 |
| 17.3 | Buat tombol download PDF | ⬜ | Critical | 17 |
| 17.4 | Integrasi export dengan API | ⬜ | Critical | 17 |
| 17.5 | Handle export job status (jika async) | ⬜ | High | 17 |

---

## Phase 18: Integration & Testing

| No | Tugas | Status | Prioritas | Phase |
|----|-------|--------|-----------|-------|
| 18.1 | Buat unit tests untuk core API endpoints | ⬜ | High | 18 |
| 18.2 | Buat unit tests untuk job pipeline | ⬜ | High | 18 |
| 18.3 | Buat integration tests end-to-end | ⬜ | Medium | 18 |
| 18.4 | Test upload → process → draft → export flow | ⬜ | Critical | 18 |
| 18.5 | Performance testing untuk file besar | ⬜ | Medium | 18 |

---

## Phase 19: Deployment & DevOps

| No | Tugas | Status | Prioritas | Phase |
|----|-------|--------|-----------|-------|
| 19.1 | Buat Dockerfile untuk `api` | ⬜ | High | 19 |
| 19.2 | Buat Dockerfile untuk `worker` | ⬜ | High | 19 |
| 19.3 | Buat Dockerfile untuk `web` (production build) | ⬜ | High | 19 |
| 19.4 | Update docker-compose untuk production | ⬜ | High | 19 |
| 19.5 | Setup health check endpoints | ⬜ | Medium | 19 |
| 19.6 | Dokumentasi deployment | ⬜ | Medium | 19 |

---

## Summary

| Phase | Deskripsi | Total Tasks |
|-------|-----------|-------------|
| 0 | Project Setup & Infrastructure | 7 |
| 1 | Backend Foundation | 13 |
| 2 | Authentication | 7 |
| 3 | Core API - Reports & Files | 11 |
| 4 | Async Job Queue | 6 |
| 5 | Document Parsing | 6 |
| 6 | LLM Provider | 8 |
| 7 | RAG & Embedding | 5 |
| 8 | Facts Builder & Draft Generator | 7 |
| 9 | Draft API & Versioning | 5 |
| 10 | Template System | 5 |
| 11 | Export (DOCX & PDF) | 8 |
| 12 | Frontend Foundation | 8 |
| 13 | Frontend - Auth | 4 |
| 14 | Frontend - Report List | 5 |
| 15 | Frontend - Report Detail | 8 |
| 16 | Frontend - Draft Editor | 8 |
| 17 | Frontend - Export | 5 |
| 18 | Integration & Testing | 5 |
| 19 | Deployment | 6 |
| **Total** | | **137** |

---

> Catatan: Prioritas `Critical` harus selesai untuk MVP. `High` sangat direkomendasikan. `Medium/Low` bisa ditunda.
