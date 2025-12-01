from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Body
from app.services.session_service import session_service
from app.services.pharmacist_agent import pharmacist_agent
from app.services.scheduler_agent import scheduler_agent
from typing import List
import io
from PIL import Image

router = APIRouter()

@router.post("/process-prescription/{session_id}")
async def process_prescription(session_id: str, file: UploadFile = File(...)):
    session = session_service.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Read image
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    # Prepare for Gemini
    # In a real app we might need to handle different image formats better
    # For now we assume it works or we convert to compatible format
    
    image_parts = {
        "mime_type": file.content_type,
        "data": contents
    }

    # 1. Pharmacist Agent: Extract Info
    print("Calling Pharmacist Agent...")
    medications = await pharmacist_agent.extract_medication_info(image_parts)
    print(f"Pharmacist Agent found: {medications}")
    
    # 2. Scheduler Agent: Generate Schedule
    if medications:
        print("Calling Scheduler Agent...")
        medications = await scheduler_agent.generate_schedule(session.user_context, medications)
        print(f"Scheduler Agent returned: {medications}")
    
    session.medications = medications
    
    return {"medications": medications}
