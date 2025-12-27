import pytest
from fastapi.testclient import TestClient


def test_create_report(client, auth_headers):
    """Test creating a report."""
    response = client.post(
        "/api/v1/reports",
        json={
            "title": "Test Report",
            "org_id": 1
        },
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Report"
    assert data["status"] == "drafting"
    assert "id" in data


def test_list_reports(client, auth_headers):
    """Test listing reports."""
    # Create a report first
    client.post(
        "/api/v1/reports",
        json={"title": "Test Report 1", "org_id": 1},
        headers=auth_headers
    )
    
    response = client.get("/api/v1/reports", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_get_report_detail(client, auth_headers):
    """Test getting report detail."""
    # Create a report
    create_response = client.post(
        "/api/v1/reports",
        json={"title": "Test Report", "org_id": 1},
        headers=auth_headers
    )
    report_id = create_response.json()["id"]
    
    # Get detail
    response = client.get(f"/api/v1/reports/{report_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == report_id
    assert data["title"] == "Test Report"


def test_update_report(client, auth_headers):
    """Test updating report."""
    # Create a report
    create_response = client.post(
        "/api/v1/reports",
        json={"title": "Original Title", "org_id": 1},
        headers=auth_headers
    )
    report_id = create_response.json()["id"]
    
    # Update
    response = client.patch(
        f"/api/v1/reports/{report_id}",
        json={"title": "Updated Title"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"


def test_unauthorized_report_access(client):
    """Test unauthorized report access."""
    response = client.get("/api/v1/reports")
    assert response.status_code == 401
