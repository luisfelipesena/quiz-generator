#!/bin/bash

# Change to the project root directory
cd "$(dirname "$0")/.."

# AI-Powered PDF Quiz Generator - Development Startup Script

echo "🧪 Starting AI-Powered PDF Quiz Generator..."
echo "=========================================="

# Check if virtual environment exists
if [ ! -d "apps/backend/venv" ]; then
    echo "❌ Python virtual environment not found!"
    echo "Please run: python3 -m venv apps/backend/venv"
    echo "Then run: source apps/backend/venv/bin/activate && pip install -r apps/backend/requirements.txt"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file with your OpenAI API key:"
    echo "OPENAI_API_KEY=sk-your-openai-api-key-here"
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000"
    exit 1
fi

echo "🐍 Starting FastAPI backend server..."
# Start backend in background
source apps/backend/venv/bin/activate && cd apps/backend && python -m fastapi dev main.py --reload &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

echo "⚛️  Starting Next.js frontend server..."
# Start frontend in background (disable debugger to avoid conflicts)
cd apps/frontend && NODE_OPTIONS="" bun dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servers started successfully!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📖 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup INT

# Wait for processes
wait