# Test Suite - Sijadin API

## Overview

Test suite untuk Sijadin API menggunakan pytest dengan in-memory SQLite database.

## Test Categories

### Unit Tests (No External Dependencies)
Tests yang berjalan tanpa memerlukan service eksternal:
- `test_auth.py` - Authentication tests
- `test_reports.py` - Report CRUD tests
- `test_draft.py` - Draft management tests (basic)

### Integration Tests (Requires External Services)
Tests yang memerlukan service eksternal (MinIO, Redis, Worker):
- `test_files.py` - File upload tests (requires MinIO)
- `test_export.py` - Export tests (requires templates & export services)
- `test_integration.py` - Full workflow tests (requires all services)

## Running Tests

### Run Unit Tests Only
```bash
pytest -v -m "not skip"
```

### Run All Tests (Including Skipped)
```bash
pytest -v --run-skipped
```

### Run Specific Test File
```bash
pytest tests/test_auth.py -v
```

### Run with Coverage
```bash
pytest --cov=app --cov-report=html
```

## Test Configuration

### Skipped Tests
Beberapa test di-skip secara default karena memerlukan service eksternal:
- File upload tests (requires MinIO)
- Export tests (requires template engine & Playwright)
- Full workflow tests (requires all services)

Untuk menjalankan test ini, pastikan semua service berjalan:
```bash
# Start all services
docker-compose up -d

# Run all tests
pytest -v --run-skipped
```

### Test Database
Tests menggunakan in-memory SQLite database yang dibuat dan dihapus untuk setiap test function.

### Test Fixtures
- `db` - Database session
- `client` - FastAPI TestClient
- `test_user` - Pre-created test user
- `auth_headers` - Authentication headers
- `test_report` - Pre-created test report

## Test Structure

```
tests/
├── __init__.py
├── conftest.py              # Fixtures & configuration
├── test_auth.py             # ✅ Unit tests
├── test_reports.py          # ✅ Unit tests
├── test_draft.py            # ✅ Unit tests
├── test_files.py            # ⏭️ Requires MinIO
├── test_export.py           # ⏭️ Requires export services
└── test_integration.py      # ⏭️ Requires all services
```

## Writing Tests

### Basic Test
```python
def test_example(client, auth_headers):
    response = client.get("/api/v1/endpoint", headers=auth_headers)
    assert response.status_code == 200
```

### Skip Test
```python
@pytest.mark.skip(reason="Requires external service")
def test_with_external_service(client):
    # Test code
    pass
```

## CI/CD Integration

Untuk CI/CD, jalankan hanya unit tests:
```bash
pytest -v -m "not skip"
```

Integration tests dapat dijalankan di environment staging/production dengan semua service aktif.

## Troubleshooting

### Import Errors
Pastikan berada di directory yang benar:
```bash
cd apps/api
pytest -v
```

### Database Errors
Tests menggunakan in-memory SQLite, tidak perlu setup database eksternal.

### Service Connection Errors
Jika test mencoba connect ke service eksternal, pastikan test sudah di-skip dengan `@pytest.mark.skip`.

## Notes

- Unit tests harus cepat (< 1s per test)
- Integration tests boleh lebih lambat
- Semua test harus independent (tidak bergantung pada test lain)
- Gunakan fixtures untuk setup/teardown
- Mock external services untuk unit tests
