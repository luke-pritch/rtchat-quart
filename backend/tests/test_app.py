import pytest
from app import app

@pytest.mark.asyncio
async def test_index():
    client = app.test_client()
    response = await client.get('/')
    assert response.status_code == 200
    assert await response.get_data() == b"Quart Chat Backend - Real-Time Chat Application"