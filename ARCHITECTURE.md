# Sijadin - Architecture Documentation

## Overview

Sijadin adalah aplikasi web untuk membuat laporan perjalanan dinas secara semi-otomatis dengan bantuan AI. Aplikasi ini menggunakan arsitektur monorepo dengan pemisahan yang jelas antara frontend, backend, dan worker.

## System Architecture

```
┌─────────────┐
│   Browser   │
│  (React)    │
└──────┬──────┘
       │ HTTP/REST
       ▼
┌─────────────┐      ┌──────────┐
│   FastAPI   │◄────►│  MinIO   │
│     API     │      │ (Storage)│
└──────┬──────┘      └──────────┘
       │
       ├──────────────┬──────────────┐
       ▼              ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│PostgreSQL│   │  Redis   │   │   RQ     │
│(+pgvector)│   │ (Queue)  │   │ Worker   │
└──────────┘   └──────────┘   └────┬─────┘
                                    │
                                    ▼
                              ┌──────────┐
                              │   LLM    │
                              │ Provider │
                              └──────────┘
```

## Components

### 1. Frontend (apps/web)
- **Framework**: React + Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Editor**: Tiptap
- **State Management**: TanStack Query
- **Responsibilities**:
  - User interface
  - File upload
  - Draft editing
  - Export management

### 2. Backend API (apps/api)
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Database**: PostgreSQL + pgvector
- **ORM**: SQLAlchemy (async)
- **Migrations**: Alembic
- **Responsibilities**:
  - REST API endpoints
  - Authentication & authorization
  - Business logic
  - Job queue management
  - File management

### 3. Worker (apps/worker)
- **Queue**: RQ (Redis Queue)
- **Language**: Python 3.11+
- **Responsibilities**:
  - Document parsing (PDF, DOCX)
  - AI processing (LLM calls)
  - Draft generation
  - Export generation

### 4. Storage (MinIO)
- **Type**: S3-compatible object storage
- **Buckets**:
  - `uploads`: User uploaded files
  - `exports`: Generated DOCX/PDF files
  - `artifacts`: Temporary processing files

### 5. Database (PostgreSQL + pgvector)
- **Purpose**: 
  - Metadata storage
  - Draft versions
  - User management
  - Vector embeddings (RAG)

### 6. Cache & Queue (Redis)
- **Purpose**:
  - Job queue (RQ)
  - Session cache
  - Rate limiting

## Data Flow

### Upload & Processing Flow
```
1. User uploads files
   ↓
2. API saves to MinIO + metadata to DB
   ↓
3. User triggers processing
   ↓
4. API creates job in Redis queue
   ↓
5. Worker picks up job
   ↓
6. Worker processes:
   - Classify files
   - Extract text/vision
   - Build facts JSON
   - Generate embeddings
   - Generate draft
   ↓
7. Worker saves draft to DB
   ↓
8. User edits draft in UI
   ↓
9. User exports to DOCX/PDF
```

## Database Schema

### Core Tables
- `users` - User accounts
- `organizations` - Organizations/units
- `doc_templates` - DOCX templates + schemas
- `reports` - Report metadata
- `report_files` - Uploaded files metadata
- `report_draft_versions` - Draft versions (JSON)
- `job_runs` - Job execution tracking
- `exports` - Export history

### Relationships
```
organizations
  ├── doc_templates
  └── reports
      ├── report_files
      ├── report_draft_versions
      ├── job_runs
      └── exports

users
  ├── reports (created_by)
  └── report_draft_versions (created_by)
```

## API Design

### Endpoints Structure
```
/api/v1
  /auth
    POST /register
    POST /login
    GET  /me
  /reports
    POST   /
    GET    /
    GET    /{id}
    PATCH  /{id}
    POST   /{id}/files
    GET    /{id}/files
    POST   /{id}/process
    GET    /{id}/draft
    PATCH  /{id}/draft
    POST   /{id}/export
  /files
    GET /{file_id}/download
  /jobs
    GET /{job_id}
  /exports
    GET /{export_id}/download
```

## Security

### Authentication
- JWT tokens
- Password hashing (bcrypt/argon2)
- Token expiration

### Authorization
- Role-based access control (RBAC)
- Resource ownership validation

### File Upload
- MIME type validation
- File size limits
- Virus scanning (optional)

## Scalability Considerations

### Current (MVP)
- Single server deployment
- Local MinIO
- Single worker instance

### Future Improvements
- Horizontal scaling of API servers
- Multiple worker instances
- Distributed MinIO cluster
- Database read replicas
- CDN for static assets
- Load balancer

## Development Workflow

### Local Development
1. Start infrastructure: `docker-compose up -d postgres redis minio`
2. Run migrations: `alembic upgrade head`
3. Start API: `uvicorn main:app --reload`
4. Start worker: `python worker.py`
5. Start frontend: `npm run dev`

### Testing
- Unit tests: pytest (backend), vitest (frontend)
- Integration tests: End-to-end flow testing
- Load tests: Performance testing with large files

### Deployment
- Docker Compose for full stack
- Environment-specific configurations
- Health checks for all services

## Monitoring & Logging

### Logs
- Application logs (structured JSON)
- Access logs (API requests)
- Error logs (exceptions)

### Metrics (Future)
- Request rate
- Response time
- Job queue length
- Worker utilization
- Storage usage

## Technology Decisions

### Why FastAPI?
- Modern async Python framework
- Automatic API documentation
- Type safety with Pydantic
- High performance

### Why PostgreSQL + pgvector?
- Reliable relational database
- Vector similarity search for RAG
- JSON support for flexible schemas

### Why MinIO?
- S3-compatible API
- Self-hosted solution
- Easy to scale

### Why RQ?
- Simple Redis-based queue
- Python-native
- Easy debugging

### Why React + Vite?
- Fast development experience
- Modern tooling
- Large ecosystem

## Future Enhancements

1. **Real-time collaboration**: Multiple users editing same draft
2. **Advanced AI**: Fine-tuned models for better extraction
3. **Mobile app**: React Native or PWA
4. **API versioning**: Support multiple API versions
5. **Webhooks**: Notify external systems
6. **Audit trail**: Detailed change history
7. **Multi-language**: i18n support
