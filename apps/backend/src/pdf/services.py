"""
PDF services - Business logic for PDF processing
"""
import io
import os
import tempfile
from typing import Optional

import PyPDF2
from fastapi import HTTPException, UploadFile
from src.pdf.dto import PdfUploadResponse


class PdfProcessingService:
    """Service for processing PDF files"""

    @staticmethod
    async def extract_text_from_pdf(file: UploadFile) -> PdfUploadResponse:
        """
        Extract text from uploaded PDF file

        Args:
            file: The uploaded PDF file

        Returns:
            PdfUploadResponse with extracted text and file info

        Raises:
            HTTPException: If PDF processing fails
        """
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="File must be a PDF")

        try:
            # Read file contents
            contents = await file.read()
            file_size = len(contents)

            # Extract text using PyPDF2
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(contents))

            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()

            if not text.strip():
                raise HTTPException(
                    status_code=400,
                    detail="PDF appears to be empty or text could not be extracted",
                )

            return PdfUploadResponse(
                success=True,
                text_extracted=text,
                file_name=file.filename,
                file_size=file_size,
            )

        except HTTPException:
            # Re-raise HTTP exceptions as-is
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Error processing PDF: {str(e)}"
            )

    @staticmethod
    def validate_pdf_file(file: UploadFile, max_size_mb: int = 10) -> Optional[str]:
        """
        Validate PDF file before processing

        Args:
            file: The uploaded file
            max_size_mb: Maximum allowed file size in MB

        Returns:
            Error message if validation fails, None if valid
        """
        if not file.filename:
            return "No file provided"

        if not file.filename.endswith(".pdf"):
            return "File must be a PDF"

        # Note: FastAPI doesn't provide file size directly for UploadFile
        # Size validation would need to be done after reading the file

        return None
