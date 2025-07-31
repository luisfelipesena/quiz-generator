"""
Quiz Generator API - Main application entry point

This is the main FastAPI application that orchestrates all the modules
following a clean architecture pattern:
- API Layer: Route handlers (api.py files)
- Service Layer: Business logic (services.py files)
- DTO Layer: Data transfer objects (dto.py files)
"""

import os

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

# CORS configuration for development and production
allowed_origins = [
    "http://localhost:3000",  # Local development
    "http://127.0.0.1:3000",  # Alternative local development
    "https://quiz-generator-frontend-psi.vercel.app",  # Production frontend
]

# Add production origins from environment variable
cors_origins = os.getenv("CORS_ORIGINS", "")
if cors_origins:
    # Support comma-separated origins for production
    production_origins = [origin.strip() for origin in cors_origins.split(",")]
    allowed_origins.extend(production_origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Content-Language",
        "Content-Type",
        "Authorization",
        "X-Session-ID",
        "x-session-id",
        "Quiz-Title",
    ],
    expose_headers=["*"],
)

app.include_router(common_router)
app.include_router(quiz_router)
app.include_router(pdf_router)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
