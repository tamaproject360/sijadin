import pytest
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


def test_get_draft(client, auth_headers, test_report):
    """Test getting draft."""
    report_id = test_report["id"]
    
    response = client.get(
        f"/api/v1/reports/{report_id}/draft",
        headers=auth_headers
    )
    # May return 404 if no draft yet, or 200 with draft
    assert response.status_code in [200, 404]


def test_update_draft(client, auth_headers, test_report):
    """Test updating draft."""
    report_id = test_report["id"]
    
    draft_data = {
        "template_id": "tpl-test-v1",
        "title": "Test Draft",
        "meta": {
            "activity_name": "Test Activity",
            "location": "Test Location",
            "date_start": "2024-01-01",
            "date_end": "2024-01-02",
            "unit": "Test Unit",
            "participants": ["Person 1", "Person 2"]
        },
        "sections": [
            {
                "key": "pendahuluan",
                "title": "Pendahuluan",
                "content": "<p>Test content</p>"
            }
        ]
    }
    
    response = client.patch(
        f"/api/v1/reports/{report_id}/draft",
        json=draft_data,
        headers=auth_headers
    )
    assert response.status_code == 200


def test_get_draft_versions(client, auth_headers, test_report):
    """Test getting draft versions."""
    report_id = test_report["id"]
    
    response = client.get(
        f"/api/v1/reports/{report_id}/draft/versions",
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
