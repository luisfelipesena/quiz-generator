from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import PyPDF2
import io
from openai import OpenAI
import json

load_dotenv()

app = FastAPI(title="Quiz Generator API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class QuestionAnswer(BaseModel):
    id: str
    question: str
    answer: str
    options: Optional[List[str]] = None

class QuizRequest(BaseModel):
    questions: List[QuestionAnswer]

class QuizResponse(BaseModel):
    questions: List[QuestionAnswer]

class AnswerRequest(BaseModel):
    question_id: str
    user_answer: str

class AnswerResponse(BaseModel):
    correct: bool
    correct_answer: str
    explanation: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "Quiz Generator API"}

@app.post("/upload-pdf", response_model=QuizResponse)
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        contents = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(contents))
        
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="PDF appears to be empty or text could not be extracted")
        
        # Generate questions using OpenAI
        questions = await generate_questions(text)
        
        # Store questions in memory (in production, use a database)
        for question in questions:
            questions_storage[question.id] = question
        
        return QuizResponse(questions=questions)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

async def generate_questions(text: str) -> List[QuestionAnswer]:
    try:
        prompt = f"""
        Based on the following text, generate exactly 10 multiple-choice questions with 4 options each.
        
        Format your response as a JSON array with this structure:
        [
            {{
                "id": "1",
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
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that creates quiz questions. Always respond with valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        
        questions_data = json.loads(response.choices[0].message.content)
        
        questions = []
        for i, q in enumerate(questions_data[:10]):  # Ensure max 10 questions
            questions.append(QuestionAnswer(
                id=str(i + 1),
                question=q["question"],
                answer=q["answer"],
                options=q.get("options", [])
            ))
        
        return questions
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating questions: {str(e)}")

@app.put("/questions/{question_id}")
async def update_question(question_id: str, question: QuestionAnswer):
    # In a real app, you'd store this in a database
    # For now, just return the updated question
    return question

# In-memory storage for questions (in production, use a database)
questions_storage = {}

@app.post("/check-answer", response_model=AnswerResponse)
async def check_answer(answer_request: AnswerRequest):
    # Look up the correct answer from storage
    question = questions_storage.get(answer_request.question_id)
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    correct_answer = question.answer
    user_answer = answer_request.user_answer.strip()
    
    # Check if the user's answer matches the correct answer (case-insensitive)
    is_correct = user_answer.lower() == correct_answer.lower()
    
    # If it's a multiple choice question, also check if any option matches
    if not is_correct and question.options:
        for option in question.options:
            if user_answer.lower() == option.lower() and option.lower() == correct_answer.lower():
                is_correct = True
                break
    
    return AnswerResponse(
        correct=is_correct,
        correct_answer=correct_answer,
        explanation="Correct! Well done!" if is_correct else f"The correct answer is: {correct_answer}"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)