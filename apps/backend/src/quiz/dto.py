"""
Quiz-related Data Transfer Objects (DTOs)
"""
from pydantic import BaseModel, Field
from typing import List, Optional


class QuestionAnswer(BaseModel):
    """DTO for a quiz question with its answer and options"""
    id: str = Field(..., description="Unique identifier for the question")
    question: str = Field(..., description="The question text")
    answer: str = Field(..., description="The correct answer")
    options: Optional[List[str]] = Field(None, description="Multiple choice options")


class QuizRequest(BaseModel):
    """DTO for requesting quiz operations"""
    questions: List[QuestionAnswer] = Field(..., description="List of quiz questions")


class QuizResponse(BaseModel):
    """DTO for quiz response containing generated questions"""
    questions: List[QuestionAnswer] = Field(..., description="List of generated quiz questions")


class AnswerRequest(BaseModel):
    """DTO for submitting an answer to a question"""
    question_id: str = Field(..., description="ID of the question being answered")
    user_answer: str = Field(..., description="User's submitted answer")


class AnswerResponse(BaseModel):
    """DTO for answer validation response"""
    correct: bool = Field(..., description="Whether the answer is correct")
    correct_answer: str = Field(..., description="The correct answer")
    explanation: Optional[str] = Field(None, description="Explanation of the answer")


class QuestionUpdateRequest(BaseModel):
    """DTO for updating a question"""
    id: str = Field(..., description="Question ID")
    question: str = Field(..., description="Updated question text")
    answer: str = Field(..., description="Updated correct answer")
    options: Optional[List[str]] = Field(None, description="Updated multiple choice options")