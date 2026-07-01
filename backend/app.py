from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path) # Force loading exactly from backend/.env

# Debug check to print if key is missing (safe to log missing status)
if not os.getenv("GEMINI_API_KEY"):
    print("WARNING: GEMINI_API_KEY is missing or the .env file is empty/unsaved!")

from vision_service import extract_infrastructure_graph
from analytics_service import generate_insights

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.get("/")
def home():
    return {
        "message": "InfraSight AI Backend Running"
    }

@app.post("/analyze")
async def analyze_diagram(file: UploadFile = File(...)):
    """
    Endpoint that handles the full pipeline:
    1. Save uploaded image
    2. Extract structural graph using Gemini Vision
    3. Generate architectural insights based on the graph
    """
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    # Step 1: Vision Extraction
    graph_result = extract_infrastructure_graph(file_path)
    
    if "error" in graph_result:
        raise HTTPException(status_code=500, detail=graph_result["error"])

    # Step 2: Insight Generation
    insights = generate_insights(graph_result)
    
    if "error" in insights:
        raise HTTPException(status_code=500, detail=insights["error"])

    # Provide unified response
    return {
        "filename": file.filename,
        "graph": graph_result,
        "insights": insights,
        "saved_to": file_path
    }