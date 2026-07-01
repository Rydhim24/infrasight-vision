from google import genai
from pydantic import BaseModel, Field
import json

class ArchitectureInsights(BaseModel):
    summary: str = Field(description="A comprehensive summary of the architecture and its purpose.")
    security_risks: list[str] = Field(description="List of potential security vulnerabilities or missing best practices.")
    cost_optimization: list[str] = Field(description="Recommendations to reduce operational costs.")
    scalability_recommendations: list[str] = Field(description="Suggestions for improving elasticity and performance.")

def generate_insights(infrastructure_graph: dict) -> dict:
    """
    Takes the structured infrastructure graph and uses Gemini to generate 
    comprehensive architecture insights.
    """
    import os
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"summary": "API Error", "security_risks": [], "cost_optimization": [], "scalability_recommendations": [], "error": "API Key is missing"}
        
    client = genai.Client(api_key=api_key)
    
    graph_json = json.dumps(infrastructure_graph, indent=2)
    
    prompt = (
        "You are an expert Cloud Architect and Security Specialist. "
        "Review the following extracted cloud infrastructure data:\n\n"
        f"{graph_json}\n\n"
        "Generate a detailed analysis including an architecture summary, "
        "potential security risks, cost optimization strategies, and "
        "scalability recommendations."
    )
    
    try:
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=prompt,
            config=genai.types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=ArchitectureInsights,
                temperature=0.2
            ),
        )
        
        return json.loads(response.text)
        
    except Exception as e:
        print(f"Error generating insights: {e}")
        return {
            "summary": "Could not generate insights.",
            "security_risks": [],
            "cost_optimization": [],
            "scalability_recommendations": [],
            "error": str(e)
        }
