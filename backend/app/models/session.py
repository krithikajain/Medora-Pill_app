from pydantic import BaseModel
from typing import List, Optional

class Medication(BaseModel):
    name: str
    dosage: str
    frequency: str
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
