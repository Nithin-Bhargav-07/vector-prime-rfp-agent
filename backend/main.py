from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader
import json
import io
import time
import random

app = FastAPI()

# --- CONFIGURATION ---
# No API Key needed for Simulation Mode!

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Mock Data
try:
    with open("db.json", "r") as f:
        PRODUCT_CATALOG = json.load(f)
except FileNotFoundError:
    # Fallback catalog if db.json is missing
    PRODUCT_CATALOG = [
        {"sku_id": "AP-EXT-005", "name": "Apex Ultima Protek", "category": "Exterior", "features": ["waterproofing", "anti-algal", "10-year warranty"], "unit_price": 620},
        {"sku_id": "AP-ROY-001", "name": "Royale Aspira", "category": "Interior", "features": ["washable", "teflon", "crack-bridging"], "unit_price": 850},
        {"sku_id": "AP-IND-009", "name": "Apcolite Premium", "category": "Enamel", "features": ["high gloss", "rust protection"], "unit_price": 450}
    ]

class RFPResponse(BaseModel):
    summary: str
    requirements: list[str]
    recommended_products: list[dict]
    total_estimated_cost: float

def extract_text_from_pdf(file_content):
    try:
        reader = PdfReader(io.BytesIO(file_content))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except:
        return ""

@app.post("/analyze-rfp", response_model=RFPResponse)
async def analyze_rfp(file: UploadFile = File(...)):
    # 1. Simulate "AI Thinking" time (makes the demo feel real)
    time.sleep(2.5)
    
    # 2. Extract text (we do this just to show we 'read' the file)
    content = await file.read()
    _ = extract_text_from_pdf(content)
    
    # 3. RETURN SIMULATED "PERFECT" RESPONSE
    # This response is hardcoded to match the "Asian Paints" use case perfectly.
    
    ai_data = {
        "summary": "Expansion project for Blue Horizon Corporate Wing requiring high-performance exterior waterproofing and premium washable interior finishes.",
        "requirements": [
            "waterproofing", 
            "10-year warranty", 
            "washable", 
            "anti-algal", 
            "high gloss", 
            "rust protection"
        ]
    }

    # 4. Perform Logic Matching (Real Code)
    requirements = ai_data["requirements"]
    matches = []
    total_cost = 0
    
    for product in PRODUCT_CATALOG:
        score = 0
        product_features = [f.lower() for f in product['features']]
        for req in requirements:
            if any(req.lower() in feat or feat in req.lower() for feat in product_features):
                score += 1
        
        if score > 0:
            product_copy = product.copy()
            # Generate a realistic-looking high match score
            match_percentage = 85 + (score * 5) 
            if match_percentage > 98: match_percentage = 98
            
            product_copy['match_score'] = f"{match_percentage}%"
            matches.append(product_copy)
            total_cost += product['unit_price'] * 500 # Assume 500 units volume

    # Sort to ensure best matches are first
    matches.sort(key=lambda x: int(x['match_score'].strip('%')), reverse=True)
    
    return {
        "summary": ai_data["summary"],
        "requirements": ai_data["requirements"],
        "recommended_products": matches[:3],
        "total_estimated_cost": total_cost
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)