"""
Quiz services - Business logic for quiz operations
"""

import json
import os
from typing import AsyncGenerator, Dict, List, Optional, Tuple

from fastapi import HTTPException
from openai import OpenAI
from src.quiz.dto import (
    AnswerRequest,
    AnswerResponse,
    QuestionAnswer,
    QuestionUpdateRequest,
)


class QuizGenerationService:
    """Service for generating quiz questions using OpenAI"""

    def __init__(self):
        self._client = None

    @property
    def client(self):
        """Lazy initialization of OpenAI client"""
        if self._client is None:
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise HTTPException(
                    status_code=500,
                    detail="OpenAI API key not configured. Please check your environment variables.",
                )

            self._client = OpenAI(api_key=api_key)
        return self._client

    async def generate_questions_from_text(
        self, text: str, num_questions: int = 10
    ) -> List[QuestionAnswer]:
        """
        Generate quiz questions from extracted text using OpenAI

        Args:
            text: The extracted text from PDF
            num_questions: Number of questions to generate

        Returns:
            List of generated QuestionAnswer objects

        Raises:
            HTTPException: If question generation fails
        """
        try:
            prompt = self._build_generation_prompt(text, num_questions)

            # Add timeout and retry logic
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that creates quiz questions. Always respond with valid JSON only.",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.7,
                timeout=30,  # 30 second timeout
            )

            # Check if response and content exist
            if not response.choices or not response.choices[0].message.content:
                raise HTTPException(
                    status_code=500,
                    detail="OpenAI returned empty response. Please try again.",
                )

            content = response.choices[0].message.content.strip()
            if not content:
                raise HTTPException(
                    status_code=500,
                    detail="OpenAI returned empty content. Please try again.",
                )

            # Try to parse JSON response
            try:
                questions_data = json.loads(content)
            except json.JSONDecodeError:
                raise HTTPException(
                    status_code=500,
                    detail="OpenAI returned invalid response format. Please try again.",
                )

            # Validate response format
            if not isinstance(questions_data, list):
                raise HTTPException(
                    status_code=500,
                    detail="Invalid response format from AI. Please try again.",
                )

            if len(questions_data) == 0:
                raise HTTPException(
                    status_code=500,
                    detail="AI did not generate any questions. Please try again.",
                )

            questions = []
            for i, q in enumerate(questions_data[:num_questions]):
                try:
                    # Validate question structure
                    if not isinstance(q, dict):
                        raise ValueError(f"Question {i+1} is not a valid object")

                    if "question" not in q or "answer" not in q:
                        raise ValueError(f"Question {i+1} missing required fields")

                    question_text = str(q["question"]).strip()
                    correct_answer = str(q["answer"]).strip()
                    options = q.get("options", [])

                    # Validate that correct answer is in options
                    if options and correct_answer not in options:
                        # Try to find a case-insensitive match
                        matching_option = None
                        for option in options:
                            if option.lower() == correct_answer.lower():
                                matching_option = option
                                break

                        if matching_option:
                            correct_answer = matching_option
                        else:
                            # Skip this question if correct answer not in options
                            continue

                    questions.append(
                        QuestionAnswer(
                            id=str(i + 1),
                            question=question_text,
                            answer=correct_answer,
                            options=options,
                        )
                    )
                except (KeyError, ValueError):
                    raise HTTPException(
                        status_code=500,
                        detail="AI generated malformed questions. Please try again.",
                    )

            if len(questions) == 0:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to generate valid questions. Please try again.",
                )

            return questions

        except json.JSONDecodeError:
            raise HTTPException(
                status_code=500,
                detail="Failed to process AI response. Please try again.",
            )
        except Exception as e:
            # Provide user-friendly error messages based on error type
            error_msg = str(e).lower()
            if "authentication" in error_msg or "api_key" in error_msg:
                detail = "AI service authentication failed. Please contact support."
            elif "rate_limit" in error_msg:
                detail = "AI service is currently busy. Please try again in a moment."
            elif "timeout" in error_msg:
                detail = "AI service took too long to respond. Please try again."
            else:
                detail = "Failed to generate questions. Please try again."

            raise HTTPException(status_code=500, detail=detail)

    def _build_generation_prompt(self, text: str, num_questions: int) -> str:
        """Build the prompt for OpenAI question generation"""
        return f"""You are an expert quiz generator. Create exactly {num_questions} multiple-choice questions based on the provided text.

CRITICAL: Respond with ONLY a valid JSON array. No extra text, explanations, or formatting.

Required JSON format:
[
    {{
        "question": "Clear, specific question text?",
        "answer": "Exact text of correct answer",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
    }}
]

Requirements:
- Each question must have exactly 4 options
- The correct answer must be one of the 4 options (exact match)
- Questions should cover different topics from the text
- Use clear, grammatically correct language
- Ensure all JSON is properly formatted with correct quotes and brackets

Text to analyze:
{text[:3500]}

Generate {num_questions} questions now:"""


class QuizManagementService:
    """Service for managing quiz questions and answers"""

    def __init__(self):
        # In-memory storage for questions by session (in production, use a database)
        # Format: {session_id: (quiz_title, {question_id: QuestionAnswer})}
        self.sessions_storage: Dict[str, Tuple[str, Dict[str, QuestionAnswer]]] = {}

    def store_questions(
        self,
        questions: List[QuestionAnswer],
        session_id: str = "default",
        quiz_title: str = "General Quiz",
    ) -> None:
        """Store questions in memory storage by session"""
        if session_id not in self.sessions_storage:
            self.sessions_storage[session_id] = (quiz_title, {})

        self.sessions_storage[session_id] = (quiz_title, {q.id: q for q in questions})

    def get_question_by_id(
        self, question_id: str, session_id: str = "default"
    ) -> Optional[QuestionAnswer]:
        """Retrieve a question by its ID for a specific session"""
        session_data = self.sessions_storage.get(session_id)
        if not session_data:
            return None

        _, questions_dict = session_data
        return questions_dict.get(question_id)

    def update_question(
        self, question_update: QuestionUpdateRequest, session_id: str = "default"
    ) -> QuestionAnswer:
        """
        Update an existing question for a specific session

        Args:
            question_update: The updated question data
            session_id: The session ID

        Returns:
            Updated QuestionAnswer object

        Raises:
            HTTPException: If question not found
        """
        session_data = self.sessions_storage.get(session_id)
        if not session_data:
            raise HTTPException(status_code=404, detail="Session not found")

        quiz_title, questions_dict = session_data
        if question_update.id not in questions_dict:
            raise HTTPException(status_code=404, detail="Question not found")

        # Validate that the correct answer is one of the options
        if (
            question_update.options
            and question_update.answer not in question_update.options
        ):
            raise HTTPException(
                status_code=400,
                detail="Correct answer must be one of the multiple choice options",
            )

        updated_question = QuestionAnswer(
            id=question_update.id,
            question=question_update.question,
            answer=question_update.answer,
            options=question_update.options,
        )

        questions_dict[question_update.id] = updated_question
        self.sessions_storage[session_id] = (quiz_title, questions_dict)
        return updated_question

    def check_answer(self, answer_request: AnswerRequest) -> AnswerResponse:
        """
        Check if the provided answer is correct. This method is stateless.

        Args:
            answer_request: The answer to check, including the list of questions.

        Returns:
            AnswerResponse with correctness and explanation

        Raises:
            HTTPException: If question not found in the provided list
        """
        question = next(
            (q for q in answer_request.questions if q.id == answer_request.question_id),
            None,
        )

        if not question:
            raise HTTPException(
                status_code=404, detail="Question not found in provided quiz context"
            )

        correct_answer = question.answer
        user_answer = answer_request.user_answer.strip()

        # Check if the user's answer matches the correct answer (case-insensitive)
        is_correct = user_answer.lower() == correct_answer.lower()

        # If it's a multiple choice question, also check if any option matches
        if not is_correct and question.options:
            for option in question.options:
                if (
                    user_answer.lower() == option.lower()
                    and option.lower() == correct_answer.lower()
                ):
                    is_correct = True
                    break

        explanation = (
            "Correct! Well done!"
            if is_correct
            else f"The correct answer is: {correct_answer}"
        )

        return AnswerResponse(
            correct=is_correct, correct_answer=correct_answer, explanation=explanation
        )

    async def get_streaming_feedback(
        self, answer_request: AnswerRequest
    ) -> AsyncGenerator[str, None]:
        """
        Get personalized streaming feedback. This method is stateless.

        Args:
            answer_request: The answer request, including the list of questions.

        Yields:
            Streaming text chunks with personalized feedback

        Raises:
            HTTPException: If question not found or streaming fails
        """
        question = next(
            (q for q in answer_request.questions if q.id == answer_request.question_id),
            None,
        )

        if not question:
            raise HTTPException(
                status_code=404, detail="Question not found in provided quiz context"
            )

        correct_answer = question.answer
        user_answer = answer_request.user_answer.strip()

        # Check if the user's answer matches the correct answer (case-insensitive)
        is_correct = user_answer.lower() == correct_answer.lower()

        # If it's a multiple choice question, also check if any option matches
        if not is_correct and question.options:
            for option in question.options:
                if (
                    user_answer.lower() == option.lower()
                    and option.lower() == correct_answer.lower()
                ):
                    is_correct = True
                    break

        # If answer is correct, just return simple confirmation
        if is_correct:
            yield "data: Correct! Well done!\n\n"
            return

        # For incorrect answers, generate personalized streaming feedback
        try:
            # Initialize OpenAI client
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise HTTPException(
                    status_code=500, detail="OpenAI API key not configured"
                )

            client = OpenAI(api_key=api_key)

            # Build prompt for personalized feedback
            feedback_prompt = f"""
            The user answered a quiz question incorrectly. Provide helpful, encouraging feedback.
            
            Question: {question.question}
            User's Answer: {user_answer}
            Correct Answer: {correct_answer}
            
            Provide a brief, encouraging explanation of:
            1. Why their answer was incorrect
            2. What the correct answer is and why it's correct
            3. A helpful tip or insight to remember for the future
            
            Keep it concise (2-3 sentences max) and encouraging. Be supportive, not critical.
            """

            # Stream the response from OpenAI
            stream = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a supportive tutor providing encouraging feedback on quiz answers. Be brief, clear, and motivating.",
                    },
                    {"role": "user", "content": feedback_prompt},
                ],
                stream=True,
                temperature=0.7,
                max_tokens=150,
            )

            # Buffer to accumulate word fragments
            word_buffer = ""
            
            # Yield each chunk as Server-Sent Events format
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    content = chunk.choices[0].delta.content
                    word_buffer += content
                    
                    # Send complete words or chunks ending with punctuation
                    if ' ' in word_buffer or any(p in word_buffer for p in '.!?,:;'):
                        # Split on spaces but keep the space
                        parts = word_buffer.split(' ')
                        if len(parts) > 1:
                            # Send all complete words
                            for i, part in enumerate(parts[:-1]):
                                if i > 0:  # Add space before words (except first)
                                    yield f"data:  \n\n"
                                yield f"data: {part}\n\n"
                            # Keep the last incomplete part in buffer
                            word_buffer = parts[-1]
                        else:
                            # Single word with punctuation - send it
                            yield f"data: {word_buffer}\n\n"
                            word_buffer = ""
            
            # Send any remaining content
            if word_buffer.strip():
                yield f"data: {word_buffer}\n\n"

            # Signal end of stream
            yield "data: [DONE]\n\n"

        except Exception as e:
            # Fallback to basic feedback if streaming fails
            yield f"data: The correct answer is: {correct_answer}. {str(e)}\n\n"


# Global singleton instances - Best approach could be to use a database
_quiz_generation_service: Optional[QuizGenerationService] = None
_quiz_management_service: Optional[QuizManagementService] = None


# Dependency injection functions for FastAPI
def get_quiz_generation_service() -> QuizGenerationService:
    """Dependency for QuizGenerationService"""
    global _quiz_generation_service
    if _quiz_generation_service is None:
        _quiz_generation_service = QuizGenerationService()
    return _quiz_generation_service


def get_quiz_management_service() -> QuizManagementService:
    """Dependency for QuizManagementService - Singleton to preserve state"""
    global _quiz_management_service
    if _quiz_management_service is None:
        _quiz_management_service = QuizManagementService()
    return _quiz_management_service
