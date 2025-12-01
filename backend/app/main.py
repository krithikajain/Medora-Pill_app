from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import onboarding, processing, calendar

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],  # Vite ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(onboarding.router, prefix="/api")
app.include_router(processing.router, prefix="/api")
app.include_router(calendar.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Prescription Scheduler API"}
