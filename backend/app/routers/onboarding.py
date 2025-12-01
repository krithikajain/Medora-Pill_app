from fastapi import APIRouter, HTTPException
from app.models.session import UserContext, Session
from app.services.session_service import session_service

router = APIRouter()

@router.post("/onboarding", response_model=Session)
async def onboard_user(context: UserContext):
    # For simplicity, we create a new session every time for now.
    # In a real app, we might handle session persistence via cookies/tokens.
    session = session_service.create_session()
    updated_session = session_service.update_user_context(session.session_id, context)
    if not updated_session:
        raise HTTPException(status_code=500, detail="Failed to create session")
    return updated_session
