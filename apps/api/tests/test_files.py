import pytest
from io import BytesIO
from fastapi.testclient import TestClient


@pytest.fixture
def test_report(client, auth_headers):
    """Create a test report."""
    response = client.post(
        "/api/v1/reports",
        json={"title": "Test Report", "org_id": 1},
        headers=auth_headers
    )
    return response.json()


@pytest.mark.skip(reason="Requires MinIO service")
def test_upload_file(client, auth_headers, test_report):
    """Test file upload."""
    report_id = test_report["id"]
    
    # Create a test file
    file_content = b"Test file content"
    files = {
        "file": ("test.pdf", BytesIO(file_content), "application/pdf")
    }
    
    response = client.post(
        f"/api/v1/reports/{report_id}/files",
        files=files,
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["filename"] == "test.pdf"
    assert data["mime"] == "application/pdf"
    assert "id" in data


def test_list_files_empty(client, auth_headers, test_report):
    """Test listing files when empty."""
    report_id = test_report["id"]
    
    response = client.get(
        f"/api/v1/reports/{report_id}/files",
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0


@pytest.mark.skip(reason="Requires MinIO service")
def test_list_files(client, auth_headers, test_report):
    """Test listing files."""
    report_id = test_report["id"]
    
    # Upload a file first
    files = {
        "file": ("test.pdf", BytesIO(b"content"), "application/pdf")
    }
    client.post(
        f"/api/v1/reports/{report_id}/files",
        files=files,
        headers=auth_headers
    )
    
    # List files
    response = client.get(
        f"/api/v1/reports/{report_id}/files",
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


@pytest.mark.skip(reason="Requires MinIO service")
def test_upload_invalid_file_type(client, auth_headers, test_report):
    """Test uploading invalid file type."""
    report_id = test_report["id"]
    
    files = {
        "file": ("test.exe", BytesIO(b"content"), "application/x-msdownload")
    }
    
    response = client.post(
        f"/api/v1/reports/{report_id}/files",
        files=files,
        headers=auth_headers
    )
    # Should reject or handle appropriately
    assert response.status_code in [400, 422]
