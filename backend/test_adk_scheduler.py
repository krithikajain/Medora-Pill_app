import asyncio
from app.services.scheduler_agent import scheduler_agent
from app.models.session import UserContext, Medication
import json

async def test_adk_scheduler():
    user_context = UserContext(
        name="Test User",
        wake_time="08:00",
        breakfast_time="09:00",
        lunch_time="13:00",
        dinner_time="19:00",
        sleep_time="22:00"
    )
    
    medications = [
        Medication(name="Test Med 1", dosage="1 tab", frequency="Twice daily", schedule=[]),
        Medication(name="Test Med 2", dosage="1 tab", frequency="Once daily", schedule=[])
    ]
    
    print("Running Scheduler Agent...")
    try:
        result = await scheduler_agent.generate_schedule(user_context, medications)
        print("Result:")
        print(json.dumps([m.dict() for m in result], indent=2))
    except Exception as e:
        print(f"Test Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_adk_scheduler())
