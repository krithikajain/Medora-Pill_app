import asyncio
from app.services.pharmacist_agent import pharmacist_agent
from app.services.scheduler_agent import scheduler_agent
from app.models.session import UserContext
import json

async def test_processing():
    # Mock User Context
    user_context = UserContext(
        name="Test User",
        wake_time="08:00",
        breakfast_time="09:00",
        lunch_time="13:00",
        dinner_time="19:00",
        sleep_time="22:00"
    )
    
    # Mock Image Parts (We can't easily mock the image bytes for Gemini without a real file, 
    # but we can try to mock the response if we were unit testing. 
    # However, we want to test the actual API call if possible.
    # Since we don't have a file, we might need to skip the actual Gemini call for Pharmacist 
    # and just test the Scheduler with mock medication data to ensure that part works).
    
    print("Testing Scheduler Agent with Mock Data...")
    mock_medications_data = [
        {"name": "Amoxicillin", "dosage": "500mg", "frequency": "Twice daily for 10 days"},
        {"name": "Ibuprofen", "dosage": "200mg", "frequency": "As needed"}
    ]
    
    # We need to convert these to Medication objects first, but PharmacistAgent returns them.
    # Let's manually create them as if Pharmacist returned them.
    from app.models.session import Medication
    medications = [
        Medication(name=m["name"], dosage=m["dosage"], frequency=m["frequency"], schedule=[])
        for m in mock_medications_data
    ]
    
    print(f"Input Medications: {medications}")
    
    try:
        updated_medications = await scheduler_agent.generate_schedule(user_context, medications)
        print("Scheduler Result:")
        print(json.dumps([m.dict() for m in updated_medications], indent=2))
    except Exception as e:
        print(f"Scheduler Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_processing())
