from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ocr import extract_text


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os

UPLOAD_FOLDER = "uploads"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

@app.get("/")
def home():
    return {"message": "GreenOps AI Backend Running"}

from fastapi import UploadFile, File




@app.post("/upload")
async def upload(
    file: UploadFile = File(...)
):
    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        buffer.write(
            await file.read()
        )

    extracted_text = extract_text(file_path)

    return {
        "filename": file.filename,
        "text": extracted_text,
        "saved_to": file_path
    }