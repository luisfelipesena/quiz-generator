"""
PDF-related Data Transfer Objects (DTOs)
"""
from pydantic import BaseModel, Field
from typing import Optional


class PdfUploadResponse(BaseModel):
    """DTO for PDF upload response"""
    success: bool = Field(..., description="Whether the PDF was processed successfully")
    text_extracted: str = Field(..., description="Extracted text from the PDF")
    file_name: str = Field(..., description="Name of the uploaded file")
    file_size: int = Field(..., description="Size of the uploaded file in bytes")


class PdfProcessingError(BaseModel):
    """DTO for PDF processing errors"""
    error: str = Field(..., description="Error message")
    file_name: Optional[str] = Field(None, description="Name of the file that caused the error")
    details: Optional[str] = Field(None, description="Additional error details")