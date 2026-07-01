from fastapi.testclient import TestClient
from app import app
import traceback

client = TestClient(app)

try:
    print("Sending test request to /analyze...")
    response = client.post(
        "/analyze",
        files={"file": ("dummy.png", b"fake image data", "image/png")}
    )
    print("Status:", response.status_code)
    print("Response JSON:", response.json())
except Exception as e:
    print("CRASH IN APP:")
    traceback.print_exc()
