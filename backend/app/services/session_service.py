from typing import Dict, Optional
from app.models.session import Session, UserContext
import uuid

class InMemorySessionService:
    def __init__(self):
        self.sessions: Dict[str, Session] = {}

    def create_session(self) -> Session:
        session_id = str(uuid.uuid4())
        session = Session(session_id=session_id)
        self.sessions[session_id] = session
        return session

    def get_session(self, session_id: str) -> Optional[Session]:
        return self.sessions.get(session_id)

    def update_user_context(self, session_id: str, context: UserContext) -> Optional[Session]:
        session = self.get_session(session_id)
        if session:
            session.user_context = context
            return session
        return None

session_service = InMemorySessionService()
