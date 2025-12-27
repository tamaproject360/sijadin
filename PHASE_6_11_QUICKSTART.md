# Phase 6-11 Quick Start Guide

Panduan cepat untuk menggunakan fitur LLM, RAG, dan Export yang baru diimplementasikan.

## Setup

### 1. Install Dependencies

Semua dependencies sudah ada di `requirements.txt`. Pastikan sudah terinstall:

```bash
cd apps/api
venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Install Playwright (untuk PDF export)

```bash
playwright install chromium
```

### 3. Setup Environment Variables

Tambahkan ke `.env`:

```bash
# LLM Providers
CHUTES_API_KEY=your_chutes_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Database Migration

```bash
cd apps/api
venv\Scripts\activate
alembic upgrade head
```

Ini akan membuat table `document_chunks` untuk RAG.

---

## Usage Examples

### 1. Test LLM Provider

```python
from app.services.llm_factory import get_llm_provider, LLMProviderType

# Get Gemini provider
llm = get_llm_provider(LLMProviderType.GEMINI)

# Generate text
result = await llm.generate_text(
    prompt="Tulis pendahuluan laporan perjalanan dinas",
    context="Kegiatan: Workshop AI\nLokasi: Jakarta",
    temperature=0.7
)
print(result)

# Classify file
category = await llm.classify_file(
    filename="surat_undangan.pdf",
    text_preview="Dengan hormat, kami mengundang...",
    mime_type="application/pdf"
)
print(f"Category: {category}")  # Output: undangan
```

### 2. Test Embedding & RAG

```python
from app.services.embedding_service import EmbeddingService
from app.services.rag_service import RAGService

# Chunk text
embedding_service = EmbeddingService()
text = "Long document text here..."
chunks = embedding_service.chunk_text(text, chunk_size=1000, overlap=200)

# Generate embeddings
embeddings = await embedding_service.generate_embeddings(chunks)

# Retrieve relevant chunks
rag = RAGService(db)
results = await rag.retrieve(
    query="Informasi tentang agenda kegiatan",
    report_id=1,
    top_k=5
)

# Build context for LLM
context = await rag.build_context(
    query="Generate section pendahuluan",
    report_id=1,
    max_tokens=2000
)
```

### 3. Build Facts from Documents

```python
from app.services.facts_builder import FactsBuilder

facts_builder = FactsBuilder()

# Extracted data from documents
extracted_data = {
    "file_1": {
        "text": "Workshop Pengembangan Sistem di Jakarta...",
        "tables": [...]
    },
    "file_2": {
        "text": "Agenda: 09:00 Pembukaan...",
    }
}

files_metadata = [
    {"id": 1, "filename": "kak.pdf", "kind": "KAK"},
    {"id": 2, "filename": "agenda.docx", "kind": "agenda"}
]

# Build facts
facts = await facts_builder.build_facts(extracted_data, files_metadata)

print(facts.activity_name)  # "Workshop Pengembangan Sistem"
print(facts.location)       # "Jakarta"
print(facts.agenda)         # [AgendaItem(...), ...]
```

### 4. Generate Draft

```python
from app.services.draft_generator import DraftGenerator
import json

# Load template schema
with open("templates/instansi_a/schema_v1.json") as f:
    template_schema = json.load(f)

# Generate draft
draft_generator = DraftGenerator(db)
draft = await draft_generator.generate_draft(
    facts=facts,
    template_schema=template_schema,
    report_id=1
)

print(draft.title)
print(draft.sections[0].content)  # Pendahuluan content
```

### 5. Export to DOCX/PDF

```python
from app.services.export_service import ExportService

export_service = ExportService()

# Export to DOCX
await export_service.export_docx(
    draft=draft,
    template_path="templates/instansi_a/template_v1.docx",
    output_path="output/laporan.docx"
)

# Export to PDF
await export_service.export_pdf(
    draft=draft,
    output_path="output/laporan.pdf"
)
```

---

## API Usage

### 1. Get Current Draft

```bash
curl http://localhost:8000/api/v1/reports/1/draft \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Update Draft

```bash
curl -X PATCH http://localhost:8000/api/v1/reports/1/draft \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "template_id": "tpl-instansi-a-v1",
    "title": "Laporan Perjalanan Dinas",
    "meta": {
      "activity_name": "Workshop AI",
      "location": "Jakarta",
      "date_start": "2024-01-15",
      "date_end": "2024-01-17",
      "unit": "Diskominfo",
      "participants": ["John Doe"]
    },
    "sections": [
      {
        "key": "pendahuluan",
        "title": "I. PENDAHULUAN",
        "content": "Laporan ini disusun..."
      }
    ]
  }'
```

### 3. List Draft Versions

```bash
curl http://localhost:8000/api/v1/reports/1/draft/versions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Restore Previous Version

```bash
curl -X POST "http://localhost:8000/api/v1/reports/1/draft/restore?version_id=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Export to DOCX

```bash
curl -X POST "http://localhost:8000/api/v1/reports/1/export?format=docx" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response:
```json
{
  "export_id": 1,
  "status": "processing",
  "message": "Export DOCX is being generated"
}
```

### 6. Download Export

```bash
curl http://localhost:8000/api/v1/exports/1/download \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response:
```json
{
  "download_url": "https://minio:9000/exports/laporan_1_20240120.docx?...",
  "filename": "laporan_1_20240120.docx",
  "format": "docx"
}
```

### 7. List Templates

```bash
curl http://localhost:8000/api/v1/templates \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 8. Get Template Schema

```bash
curl http://localhost:8000/api/v1/templates/1/schema \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Complete Workflow Example

```python
# 1. User uploads files (Phase 5 - already done)
# Files are classified and text extracted

# 2. Build facts from extracted data
facts_builder = FactsBuilder()
facts = await facts_builder.build_facts(extracted_data, files_metadata)

# 3. Generate embeddings for RAG
embedding_service = EmbeddingService()
for file_data in extracted_data.values():
    chunks = embedding_service.chunk_text(file_data["text"])
    embeddings = await embedding_service.generate_embeddings(chunks)
    
    # Save to database
    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        doc_chunk = DocumentChunk(
            report_id=report_id,
            content=chunk,
            chunk_index=i,
            embedding=embedding
        )
        db.add(doc_chunk)
    await db.commit()

# 4. Generate draft with RAG
draft_generator = DraftGenerator(db)
draft = await draft_generator.generate_draft(
    facts=facts,
    template_schema=template_schema,
    report_id=report_id
)

# 5. Save draft version
draft_version = ReportDraftVersion(
    report_id=report_id,
    version_no=1,
    draft_json=draft.model_dump(),
    created_by=user_id
)
db.add(draft_version)
await db.commit()

# 6. User edits draft via API (PATCH /reports/{id}/draft)
# Auto-creates new version

# 7. Export to DOCX/PDF
export_service = ExportService()
await export_service.export_docx(draft, template_path, output_path)
await export_service.export_pdf(draft, output_path)

# 8. Upload to MinIO
minio_client.fput_object("exports", storage_key, output_path)

# 9. User downloads via presigned URL
```

---

## Testing Checklist

- [ ] LLM provider dapat generate text
- [ ] LLM provider dapat classify file
- [ ] Embedding service dapat chunk text
- [ ] Embedding service dapat generate embeddings
- [ ] RAG service dapat retrieve relevant chunks
- [ ] Facts builder dapat extract structured data
- [ ] Draft generator dapat generate sections
- [ ] Draft API dapat save dan retrieve draft
- [ ] Draft versioning berfungsi
- [ ] Template API dapat list templates
- [ ] Export service dapat generate DOCX
- [ ] Export service dapat generate PDF
- [ ] Export API dapat create dan download export

---

## Troubleshooting

### LLM API Error
```
Error: API key not found
```
**Solution**: Pastikan `GEMINI_API_KEY` atau `CHUTES_API_KEY` sudah di set di `.env`

### Playwright Error
```
Error: Executable doesn't exist
```
**Solution**: Run `playwright install chromium`

### pgvector Error
```
Error: type "vector" does not exist
```
**Solution**: Pastikan PostgreSQL sudah install pgvector extension:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Embedding Dimension Mismatch
```
Error: expected 1536 dimensions, got 768
```
**Solution**: Update `Vector(1536)` di model sesuai dengan embedding model yang dipakai

---

## Next Steps

1. **Integrate with Worker Pipeline**: Update `process_report.py` untuk include:
   - `embed_index` step
   - `build_facts` step
   - `generate_draft` step

2. **Frontend Integration** (Phase 16-17):
   - Draft editor dengan Tiptap
   - Export button
   - Version history UI

3. **Testing** (Phase 18):
   - Unit tests untuk semua services
   - Integration tests untuk complete workflow
   - Performance testing

4. **Optimization**:
   - Cache embeddings
   - Batch processing
   - Async export jobs

---

## Documentation

- **Full Implementation**: `PHASE_6_11_COMPLETED.md`
- **Architecture**: `ARCHITECTURE.md`
- **Blueprint**: `blueprint-lpj.md`
- **Task List**: `task.md`
