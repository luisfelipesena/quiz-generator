"""
Quiz services - Business logic for quiz operations
"""

import json
import os
from typing import Dict, List, Optional

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
                    status_code=500, detail="OpenAI API key not configured"
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
            )

            questions_data = json.loads(response.choices[0].message.content)

            questions = []
            for i, q in enumerate(questions_data[:num_questions]):
                questions.append(
                    QuestionAnswer(
                        id=str(i + 1),
                        question=q["question"],
                        answer=q["answer"],
                        options=q.get("options", []),
                    )
                )

            return questions

        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=500, detail=f"Failed to parse OpenAI response: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Error generating questions: {str(e)}"
            )

    def _build_generation_prompt(self, text: str, num_questions: int) -> str:
        """Build the prompt for OpenAI question generation"""
        return f"""
        Based on the following text, generate exactly {num_questions} multiple-choice questions with 4 options each.
        
        Format your response as a JSON array with this structure:
        [
            {{
                "question": "Question text here?",
                "answer": "Correct answer text",
                "options": ["Option A", "Option B", "Option C", "Option D"]
            }}
        ]
        
        Make sure:
        - Questions are clear and specific
        - Each question has exactly 4 options
        - The correct answer is one of the 4 options
        - Questions cover different aspects of the content
        - Return valid JSON only
        
        Text: {text[:4000]}
        """


class QuizManagementService:
    """Service for managing quiz questions and answers"""

    def __init__(self):
        # In-memory storage for questions (in production, use a database)
        self.questions_storage: Dict[str, QuestionAnswer] = {}

    def store_questions(self, questions: List[QuestionAnswer]) -> None:
        """Store questions in memory storage"""
        for question in questions:
            self.questions_storage[question.id] = question

    def get_question_by_id(self, question_id: str) -> Optional[QuestionAnswer]:
        """Retrieve a question by its ID"""
        return self.questions_storage.get(question_id)

    def update_question(self, question_update: QuestionUpdateRequest) -> QuestionAnswer:
        """
        Update an existing question

        Args:
            question_update: The updated question data

        Returns:
            Updated QuestionAnswer object

        Raises:
            HTTPException: If question not found
        """
        if question_update.id not in self.questions_storage:
            raise HTTPException(status_code=404, detail="Question not found")

        updated_question = QuestionAnswer(
            id=question_update.id,
            question=question_update.question,
            answer=question_update.answer,
            options=question_update.options,
        )

        self.questions_storage[question_update.id] = updated_question
        return updated_question

    def check_answer(self, answer_request: AnswerRequest) -> AnswerResponse:
        """
        Check if the provided answer is correct

        Args:
            answer_request: The answer to check

        Returns:
            AnswerResponse with correctness and explanation

        Raises:
            HTTPException: If question not found
        """
        question = self.get_question_by_id(answer_request.question_id)

        if not question:
            raise HTTPException(status_code=404, detail="Question not found")

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


# Dependency injection functions for FastAPI
def get_quiz_generation_service() -> QuizGenerationService:
    """Dependency for QuizGenerationService"""
    return QuizGenerationService()


def get_quiz_management_service() -> QuizManagementService:
    """Dependency for QuizManagementService"""
    return QuizManagementService()
