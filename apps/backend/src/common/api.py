"""
Common API endpoints - Shared route handlers
"""
from datetime import datetime
from fastapi import APIRouter

from src.common.dto import HealthCheckResponse


# Create common router
common_router = APIRouter(tags=["Common"])


@common_router.get("/", response_model=dict)
async def root():
    """Root endpoint"""
    return {"message": "Quiz Generator API"}


@common_router.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """
    Health check endpoint
    
    Returns:
        HealthCheckResponse with service status and info
    """
    return HealthCheckResponse(
        status="healthy",
        version="1.0.0",
        timestamp=datetime.utcnow().isoformat()
    )