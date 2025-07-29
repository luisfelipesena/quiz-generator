"""
Quiz Generator API - Main application entry point

This is the main FastAPI application that orchestrates all the modules
following a clean architecture pattern:
- API Layer: Route handlers (api.py files)
- Service Layer: Business logic (services.py files)
- DTO Layer: Data transfer objects (dto.py files)
"""

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.common.api import common_router
from src.pdf.api import pdf_router
from src.quiz.api import quiz_router

load_dotenv()

app = FastAPI(
    title="Quiz Generator API",
    version="1.0.0",
    description="AI-powered quiz generator from PDF documents",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(common_router)
app.include_router(quiz_router)
app.include_router(pdf_router)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
