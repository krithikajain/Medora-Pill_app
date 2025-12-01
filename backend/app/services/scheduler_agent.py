import google.generativeai as genai
from app.services.gemini_service import get_model
from app.models.session import Medication, UserContext
from typing import List
import json

class SchedulerAgent:
    def __init__(self):
        self.model = get_model("gemini-2.0-flash-lite")

    async def generate_schedule(self, user_context: UserContext, medications: List[Medication]) -> List[Medication]:
        # Prepare context for the model
        context_str = f"""
        User Context:
        - Wake Time: {user_context.wake_time}
        - Breakfast Time: {user_context.breakfast_time}
        - Lunch Time: {user_context.lunch_time}
        - Dinner Time: {user_context.dinner_time}
        - Sleep Time: {user_context.sleep_time}
        
        Medications:
        {json.dumps([m.dict() for m in medications], indent=2)}
        """
        
        prompt = f"""
        You are an expert scheduler. Based on the user's daily routine, and the medication instructions, generate a specific daily schedule for each medication.
        
        Rules:
        - "Twice daily" usually means morning (wake time) and evening (12 hours later or before bed).
        - "With food" should align with meals (Breakfast: {user_context.breakfast_time}, Lunch: {user_context.lunch_time}, Dinner: {user_context.dinner_time}).
        - "Before bed" should be at Sleep Time ({user_context.sleep_time}).
        - "Every X hours" (e.g., Q4H, Q6H): Start at Wake Time ({user_context.wake_time}) and add X hours until Sleep Time.
        - "PRN" (As needed): If a frequency is given (e.g., Q4H), generate the max possible schedule. If no frequency (e.g., "for pain"), leave schedule empty or add a note if possible.
        - **DEFAULT RULE**: If a medication is taken once daily but no specific time is mentioned (e.g., just "1 tablet"), schedule it AFTER LUNCH ({user_context.lunch_time}).
        - Be practical.
        
        Return the updated list of medications. For each medication:
        1. Populate the 'schedule' field with a list of times (e.g., ["08:00", "20:00"]).
        2. Ensure 'duration' is preserved or updated if you can infer it better.
        
        Return ONLY the JSON list of medications.
        """
        
        response = self.model.generate_content([prompt, context_str])
        
        try:
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            
            data = json.loads(text)
            updated_medications = []
            for item in data:
                updated_medications.append(Medication(
                    name=item.get('name'),
                    dosage=item.get('dosage'),
                    frequency=item.get('frequency'),
                    duration=item.get('duration', 'Unknown'),
                    schedule=item.get('schedule', [])
                ))
            return updated_medications
        except Exception as e:
            print(f"Error parsing Scheduler response: {e}")
            return medications

scheduler_agent = SchedulerAgent()
