import pytest
from fastapi.testclient import TestClient


def test_full_workflow_basic(client, auth_headers):
    """Test basic workflow without file operations."""
    
    # 1. Create report
    response = client.post(
        "/api/v1/reports",
        json={"title": "Integration Test Report", "org_id": 1},
        headers=auth_headers
    )
    assert response.status_code == 200
    report = response.json()
    report_id = report["id"]
    assert report["status"] == "drafting"
    
    # 2. Get report detail
    response = client.get(
        f"/api/v1/reports/{report_id}",
        headers=auth_headers
    )
    assert response.status_code == 200
    
    # 3. List files (should be empty)
    response = client.get(
        f"/api/v1/reports/{report_id}/files",
        headers=auth_headers
    )
    assert response.status_code == 200
    files_list = response.json()
    assert len(files_list) == 0


@pytest.mark.skip(reason="Requires MinIO and worker services")
def test_full_workflow(client, auth_headers):
    """Test complete workflow: create → upload → process → draft → export."""
    
    # This test requires external services (MinIO, Redis, Worker)
    # Skip in unit tests, run in integration environment
    pass


def test_multiple_reports_workflow(client, auth_headers):
    """Test handling multiple reports."""
    reports = []
    
    # Create multiple reports
    for i in range(3):
        response = client.post(
            "/api/v1/reports",
            json={"title": f"Report {i+1}", "org_id": 1},
            headers=auth_headers
        )
        assert response.status_code == 200
        reports.append(response.json())
    
    # List all reports
    response = client.get("/api/v1/reports", headers=auth_headers)
    assert response.status_code == 200
    all_reports = response.json()
    assert len(all_reports) >= 3
    
    # Verify each report
    for report in reports:
        response = client.get(
            f"/api/v1/reports/{report['id']}",
            headers=auth_headers
        )
        assert response.status_code == 200
