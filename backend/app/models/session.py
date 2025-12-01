from pydantic import BaseModel
from typing import List, Optional

class Medication(BaseModel):
    name: str
    dosage: str
    frequency: str
    duration: Optional[str] = None # e.g., "7 days", "2 weeks"
    recurrence: Optional[str] = None # Google Calendar RRULE, e.g., "RRULE:FREQ=DAILY;COUNT=7"
    schedule: List[str]

class UserContext(BaseModel):
    name: str
    wake_time: str
    sleep_time: str
    breakfast_time: str
    lunch_time: str
    dinner_time: str

class Session(BaseModel):
    session_id: str
    user_context: Optional[UserContext] = None
    medications: List[Medication] = []
