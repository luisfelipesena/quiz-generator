#!/bin/bash

# Change to the project root directory
cd "$(dirname "$0")/.."

echo "🐍 Starting Backend Server..."

cd apps/backend

# Kill existing process on port 8000
lsof -ti:8000 | xargs kill -9 2>/dev/null

# Activate virtual environment and start FastAPI
source venv/bin/activate
python -m fastapi dev main.py --reload