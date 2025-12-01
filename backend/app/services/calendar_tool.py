from typing import List
from app.models.session import Medication

class CalendarTool:
    def add_to_calendar(self, medications: List[Medication]):
        # In a real application, this would use the Google Calendar API
        # to authenticate the user and add events.
        # For this demo, we will simulate the process and log the events.
        
        events_created = []
        for med in medications:
            for time in med.schedule:
                event = f"Take {med.name} ({med.dosage}) at {time}"
                events_created.append(event)
                print(f"[Calendar] Created event: {event}")
        
        return events_created

calendar_tool = CalendarTool()
