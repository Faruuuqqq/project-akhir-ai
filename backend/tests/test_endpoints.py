import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_demo_endpoint():
    response = client.get("/api/demo")
    assert response.status_code == 200
    data = response.json()
    assert "fileId" in data
    assert "analysis" in data
    assert data["analysis"]["probability"] == 0.67

@pytest.mark.asyncio
async def test_upload_invalid_file():
    # Test with invalid file
    response = client.post(
        "/api/upload",
        files={"file": ("test.txt", b"invalid")}
    )
    # Should fail because .txt is not allowed
    assert response.status_code == 400

def test_analyze_missing_file():
    response = client.post(
        "/api/analyze",
        json={"file_id": "nonexistent"}
    )
    assert response.status_code == 404