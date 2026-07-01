import os
from dotenv import load_dotenv
from google import genai

print("Loading .env file...")
load_dotenv('.env')

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ ERROR: API KEY IS MISSING! Python cannot find GEMINI_API_KEY.")
else:
    print("✅ API Key successfully found in environment!")
    print("Attempting to connect to Gemini...")
    
    try:
        client = genai.Client(api_key=api_key)
        
        # Try different model versions (fallback chain)
        models_to_try = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro']
        response = None
        
        for model in models_to_try:
            try:
                print(f"  Trying model: {model}...")
                response = client.models.generate_content(
                    model=model,
                    contents='Say the word SUCCESS strictly.'
                )
                print(f"✅ API TEST SUCCESS with {model}! Response:", response.text.strip())
                break
            except Exception as e:
                if '404' in str(e) or 'not found' in str(e).lower():
                    print(f"  Model {model} not available, trying next...")
                    continue
                else:
                    raise
        
        if response is None:
            print("❌ API FAILED! No available models found.")
    except Exception as e:
        print("❌ API FAILED! Google servers returned an error:")
        print(str(e))
