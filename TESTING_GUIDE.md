# Testing Guide - Sijadin

Panduan lengkap untuk menjalankan dan menulis test di aplikasi Sijadin.

---

## Quick Start

### Menjalankan Semua Test
```bash
# Via script (Windows)
scripts\run-tests.bat

# Via command line
cd apps/api
pytest -v
```

### Menjalankan Test dengan Coverage
```bash
# Via script (Windows)
scripts\run-tests-coverage.bat

# Via command line
cd apps/api
pytest -v --cov=app --cov-report=html --cov-report=term
```

---

## Test Structure

```
apps/api/tests/
├── __init__.py
├── conftest.py              # Fixtures & setup
├── test_auth.py             # Authentication tests
├── test_reports.py          # Report CRUD tests
├── test_files.py            # File upload tests
├── test_draft.py            # Draft management tests
├── test_export.py           # Export functionality tests
└── test_integration.py      # End-to-end tests
```

---

## Test Categories

### Unit Tests
Test individual components in isolation.

**Files:**
- `test_auth.py` - Authentication logic
- `test_reports.py` - Report operations
- `test_files.py` - File handling
- `test_draft.py` - Draft management
- `test_export.py` - Export functionality

**Run unit tests only:**
```bash
pytest tests/test_auth.py tests/test_reports.py -v
```

### Integration Tests
Test complete workflows across multiple components.

**Files:**
- `test_integration.py` - Full workflow tests

**Run integration tests:**
```bash
pytest tests/test_integration.py -v
```

---

## Test Fixtures

### Database Fixture
```python
@pytest.fixture(scope="function")
def db():
    """Create test database."""
    # Creates in-memory SQLite database
    # Automatically cleaned up after each test
```

### Client Fixture
```python
@pytest.fixture(scope="function")
def client(db):
    """Create test client."""
    # FastAPI TestClient with test database
```

### Auth Fixtures
```python
@pytest.fixture
def test_user(client):
    """Create test user."""
    # Returns user data

@pytest.fixture
def auth_headers(client, test_user):
    """Get auth headers."""
    # Returns {"Authorization": "Bearer <token>"}
```

### Report Fixtures
```python
@pytest.fixture
def test_report(client, auth_headers):
    """Create a test report."""
    # Returns report data

@pytest.fixture
def test_report_with_draft(client, auth_headers):
    """Create a test report with draft."""
    # Returns report with draft data
```

---

## Writing Tests

### Basic Test Structure
```python
def test_example(client, auth_headers):
    """Test description."""
    # Arrange
    data = {"key": "value"}
    
    # Act
    response = client.post("/api/v1/endpoint", json=data, headers=auth_headers)
    
    # Assert
    assert response.status_code == 200
    assert response.json()["key"] == "value"
```

### Testing Authentication
```python
def test_login_success(client, test_user):
    """Test successful login."""
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

### Testing File Upload
```python
from io import BytesIO

def test_upload_file(client, auth_headers, test_report):
    """Test file upload."""
    files = {
        "file": ("test.pdf", BytesIO(b"content"), "application/pdf")
    }
    response = client.post(
        f"/api/v1/reports/{test_report['id']}/files",
        files=files,
        headers=auth_headers
    )
    assert response.status_code == 200
```

### Testing Error Cases
```python
def test_unauthorized_access(client):
    """Test unauthorized access."""
    response = client.get("/api/v1/reports")
    assert response.status_code == 401

def test_invalid_data(client, auth_headers):
    """Test invalid data handling."""
    response = client.post(
        "/api/v1/reports",
        json={"invalid": "data"},
        headers=auth_headers
    )
    assert response.status_code == 422
```

---

## Running Specific Tests

### Run Single Test File
```bash
pytest tests/test_auth.py -v
```

### Run Single Test Function
```bash
pytest tests/test_auth.py::test_login_user -v
```

### Run Tests Matching Pattern
```bash
pytest -k "login" -v
```

### Run Tests with Markers
```bash
# Run only integration tests
pytest -m integration -v

# Run only unit tests
pytest -m unit -v
```

---

## Test Coverage

### Generate Coverage Report
```bash
pytest --cov=app --cov-report=html --cov-report=term
```

### View HTML Coverage Report
```bash
# Report generated in htmlcov/index.html
start htmlcov/index.html  # Windows
```

### Coverage Configuration
Coverage settings in `pytest.ini`:
```ini
[pytest]
testpaths = tests
addopts = 
    -v
    --tb=short
    --strict-markers
```

---

## Test Data

### Test User Credentials
```
Email: test@example.com
Password: testpass123
Role: user
```

### Sample Report Data
```json
{
  "title": "Test Report",
  "org_id": 1
}
```

### Sample Draft Data
```json
{
  "template_id": "tpl-test-v1",
  "title": "Test Draft",
  "meta": {
    "activity_name": "Test Activity",
    "location": "Test Location",
    "date_start": "2024-01-01",
    "date_end": "2024-01-02",
    "unit": "Test Unit",
    "participants": ["Person 1"]
  },
  "sections": [
    {
      "key": "pendahuluan",
      "title": "Pendahuluan",
      "content": "<p>Test content</p>"
    }
  ]
}
```

---

## Debugging Tests

### Run with Verbose Output
```bash
pytest -vv
```

### Show Print Statements
```bash
pytest -s
```

### Stop on First Failure
```bash
pytest -x
```

### Run Last Failed Tests
```bash
pytest --lf
```

### Show Full Traceback
```bash
pytest --tb=long
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd apps/api
          pip install -r requirements.txt
          pip install -r requirements-test.txt
      - name: Run tests
        run: |
          cd apps/api
          pytest -v --cov=app
```

---

## Best Practices

### 1. Test Naming
- Use descriptive names: `test_login_with_valid_credentials`
- Follow pattern: `test_<what>_<condition>_<expected>`

### 2. Test Independence
- Each test should be independent
- Use fixtures for setup/teardown
- Don't rely on test execution order

### 3. Arrange-Act-Assert
```python
def test_example():
    # Arrange - Setup test data
    data = {"key": "value"}
    
    # Act - Perform action
    result = function(data)
    
    # Assert - Verify result
    assert result == expected
```

### 4. Test One Thing
- Each test should verify one behavior
- Split complex tests into multiple tests

### 5. Use Fixtures
- Reuse common setup with fixtures
- Keep tests DRY (Don't Repeat Yourself)

### 6. Mock External Services
```python
from unittest.mock import patch

@patch('app.services.llm.LLMProvider')
def test_with_mock(mock_llm, client):
    mock_llm.return_value.generate_text.return_value = "mocked"
    # Test code
```

---

## Troubleshooting

### Import Errors
```bash
# Ensure you're in the correct directory
cd apps/api

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-test.txt
```

### Database Errors
```bash
# Tests use in-memory SQLite
# If issues persist, check conftest.py database setup
```

### Authentication Errors
```bash
# Ensure test_user fixture is working
# Check auth_headers fixture returns valid token
```

### Fixture Not Found
```bash
# Check conftest.py has the fixture
# Ensure fixture scope is correct
```

---

## Performance Testing

### Test Execution Time
```bash
pytest --durations=10
```

### Profile Tests
```bash
pytest --profile
```

---

## Additional Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [Coverage.py](https://coverage.readthedocs.io/)

---

**Last Updated**: December 27, 2024
