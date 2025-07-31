"""
Quiz API endpoints - Route handlers for quiz operations
"""

from typing import List, Optional

from fastapi import APIRouter, Depends, File, Header, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from src.pdf.services import PdfProcessingService
from src.quiz.dto import (
    AnswerRequest,
    AnswerResponse,
    QuestionAnswer,
    QuestionUpdateRequest,
    QuizResponse,
)
from src.quiz.services import (
    QuizGenerationService,
    QuizManagementService,
    get_quiz_generation_service,
    get_quiz_management_service,
)

# Create Quiz router
quiz_router = APIRouter(prefix="/quiz", tags=["Quiz"])


@quiz_router.post("/sync")
async def sync_questions(
    questions: List[QuestionAnswer],
    x_session_id: Optional[str] = Header(default="default"),
    quiz_title: Optional[str] = Header(default="Uploaded Quiz"),
    quiz_management_service: QuizManagementService = Depends(
        get_quiz_management_service
    ),
):
    """
    Sync questions from the client to the server's in-memory storage.
    This is useful for re-populating state after a server restart.
    """
    try:
        quiz_management_service.store_questions(
            questions, x_session_id or "default", quiz_title or "Uploaded Quiz"
        )
        return {"message": "Questions synced successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Unexpected error syncing questions: {str(e)}"
        )


@quiz_router.post("/upload-pdf", response_model=QuizResponse)
async def upload_pdf_and_generate_quiz(
    file: UploadFile = File(...),
    x_session_id: Optional[str] = Header(default="default"),
    quiz_generation_service: QuizGenerationService = Depends(
        get_quiz_generation_service
    ),
    quiz_management_service: QuizManagementService = Depends(
        get_quiz_management_service
    ),
):
    """
    Upload PDF and generate quiz questions

    Args:
        file: The uploaded PDF file
        quiz_generation_service: Injected quiz generation service
        quiz_management_service: Injected quiz management service

    Returns:
        QuizResponse with generated questions

    Raises:
        HTTPException: If PDF processing or question generation fails
    """
    try:
        # Extract text from PDF
        pdf_result = await PdfProcessingService.extract_text_from_pdf(file)

        # Use PDF filename as quiz title
        quiz_title = file.filename or "Generated Quiz"

        # Generate questions from extracted text
        questions = await quiz_generation_service.generate_questions_from_text(
            pdf_result.text_extracted
        )

        # Store questions for later reference with session ID
        quiz_management_service.store_questions(
            questions, x_session_id or "default", quiz_title
        )

        return QuizResponse(quiz_title=quiz_title, questions=questions)

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Unexpected error generating quiz: {str(e)}"
        )


@quiz_router.put("/questions/{question_id}", response_model=QuestionAnswer)
async def update_question(
    question_id: str,
    question_update: QuestionUpdateRequest,
    x_session_id: Optional[str] = Header(default="default"),
    quiz_management_service: QuizManagementService = Depends(
        get_quiz_management_service
    ),
):
    """
    Update an existing question

    Args:
        question_id: ID of the question to update
        question_update: Updated question data
        quiz_management_service: Injected quiz management service

    Returns:
        Updated QuestionAnswer object

    Raises:
        HTTPException: If question not found or update fails
    """
    try:
        # Ensure the question_id matches the one in the request body
        if question_update.id != question_id:
            raise HTTPException(
                status_code=400,
                detail="Question ID in URL must match ID in request body",
            )

        updated_question = quiz_management_service.update_question(
            question_update, x_session_id or "default"
        )
        return updated_question

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Unexpected error updating question: {str(e)}"
        )


@quiz_router.post("/check-answer", response_model=AnswerResponse)
async def check_answer(
    answer_request: AnswerRequest,
    quiz_management_service: QuizManagementService = Depends(
        get_quiz_management_service
    ),
):
    """
    Check if the provided answer is correct

    Args:
        answer_request: The answer to check
        quiz_management_service: Injected quiz management service

    Returns:
        AnswerResponse with correctness and explanation

    Raises:
        HTTPException: If question not found or answer checking fails
    """
    try:
        result = quiz_management_service.check_answer(answer_request)
        return result

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Unexpected error checking answer: {str(e)}"
        )


@quiz_router.post("/check-answer-stream")
async def check_answer_stream(
    answer_request: AnswerRequest,
    quiz_management_service: QuizManagementService = Depends(
        get_quiz_management_service
    ),
):
    """
    Check answer and provide streaming feedback for incorrect answers

    Args:
        answer_request: The answer to check
        quiz_management_service: Injected quiz management service

    Returns:
        StreamingResponse with personalized feedback

    Raises:
        HTTPException: If question not found or streaming fails
    """
    try:

        async def generate_feedback():
            async for chunk in quiz_management_service.get_streaming_feedback(
                answer_request
            ):
                yield chunk

        return StreamingResponse(
            generate_feedback(),
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
        )

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Unexpected error streaming feedback: {str(e)}"
        )
