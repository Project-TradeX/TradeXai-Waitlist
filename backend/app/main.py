from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.api import router as api_router
from app.core.config import settings
from app.core.database import engine
from app import models

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for TradeX pre-launch landing page",
    version="0.1.0",
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok", "project": settings.PROJECT_NAME}
