"""
Common Data Transfer Objects (DTOs) shared across modules
"""
from pydantic import BaseModel, Field
from typing import Optional, Any, Dict


class ApiResponse(BaseModel):
    """Generic API response wrapper"""
    success: bool = Field(..., description="Whether the operation was successful")
    message: Optional[str] = Field(None, description="Response message")
    data: Optional[Any] = Field(None, description="Response data")


class ErrorResponse(BaseModel):
    """Standard error response format"""
    error: str = Field(..., description="Error message")
    code: Optional[str] = Field(None, description="Error code")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")


class HealthCheckResponse(BaseModel):
    """Health check response"""
    status: str = Field(..., description="Service status")
    version: str = Field(..., description="API version")
    timestamp: str = Field(..., description="Current timestamp")