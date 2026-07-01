import os
from google import genai
from pydantic import BaseModel, Field
from typing import List

class ArchitectureGraph(BaseModel):
    resources: List[str] = Field(description="List of detected cloud resources (e.g. AWS EC2, Azure AKS, Load Balancer)")
    extracted_text: List[str] = Field(description="Significant text found in the diagram")
    relationships: List[str] = Field(description="Description of topological relationships (e.g. 'Load Balancer routes to AKS')")
    architecture_type: str = Field(description="The general type of architecture (e.g. 3-tier web app, serverless data pipeline)")

def extract_infrastructure_graph(image_path: str) -> dict:
    """
    Uses Gemini 1.5 Pro/Flash to analyze a cloud architecture diagram 
    and output a structured graph representation.
    """
    import os
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"error": "API Key is missing. Ensure .env is loaded properly."}
        
    client = genai.Client(api_key=api_key)
    
    prompt = (
        "You are an expert Cloud Architect. Analyze the provided "
        "cloud architecture diagram or dashboard screenshot. "
        "Identify the primary resources, any visible text, the "
        "topological relationships between components, and the overall "
        "architecture type. Return the result strictly in the requested JSON format."
    )
    
    try:
        with open(image_path, 'rb') as f:
            image_bytes = f.read()

        # Try different model versions (fallback chain)
        models_to_try = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro']
        response = None
        
        for model in models_to_try:
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=[
                        genai.types.Part.from_bytes(data=image_bytes, mime_type='image/jpeg'), 
                        prompt
                    ],
                    config=genai.types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=ArchitectureGraph,
                        temperature=0.1
                    ),
                )
                break
            except Exception as model_error:
                if '404' in str(model_error) or 'not found' in str(model_error).lower():
                    continue
                else:
                    raise
        
        import json
        return json.loads(response.text)
        
    except Exception as e:
        print(f"Error calling Gemini Vision: {e}")
        return {
            "resources": [],
            "extracted_text": [],
            "relationships": [],
            "architecture_type": "Unknown",
            "error": str(e)
        }
