from fastapi import APIRouter, HTTPException
from app.models.session import Medication
from app.services.calendar_tool import calendar_tool
from typing import List

router = APIRouter()

@router.post("/add-to-calendar")
async def add_to_calendar(medications: List[Medication]):
    try:
        events = calendar_tool.add_to_calendar(medications)
        return {"message": "Successfully added to calendar", "events": events}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
