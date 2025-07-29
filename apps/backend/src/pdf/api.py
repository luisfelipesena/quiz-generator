"""
PDF API endpoints - Route handlers for PDF operations
"""
from fastapi import APIRouter, File, UploadFile, HTTPException

from src.pdf.services import PdfProcessingService
from src.pdf.dto import PdfUploadResponse


# Create PDF router
pdf_router = APIRouter(prefix="/pdf", tags=["PDF"])


@pdf_router.post("/extract-text", response_model=PdfUploadResponse)
async def extract_text_from_pdf(file: UploadFile = File(...)):
    """
    Extract text from uploaded PDF file
    
    Args:
        file: The uploaded PDF file
        
    Returns:
        PdfUploadResponse with extracted text and file info
        
    Raises:
        HTTPException: If PDF processing fails
    """
    try:
        # Validate file before processing
        validation_error = PdfProcessingService.validate_pdf_file(file)
        if validation_error:
            raise HTTPException(status_code=400, detail=validation_error)
        
        # Process the PDF
        result = await PdfProcessingService.extract_text_from_pdf(file)
        return result
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Unexpected error processing PDF: {str(e)}"
        )