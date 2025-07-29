#!/bin/bash

# Change to the project root directory
cd "$(dirname "$0")/.."

# Simple server startup script without debug issues

echo "🧪 Starting Quiz Generator Servers..."

# Kill any existing processes on these ports
echo "🔄 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null

# Start backend
echo "🐍 Starting backend server..."
cd apps/backend
source venv/bin/activate
python -m fastapi dev main.py --reload &
BACKEND_PID=$!
cd ../..

# Wait for backend to start
sleep 5

# Start frontend with clean environment
echo "⚛️ Starting frontend server..."
cd apps/frontend
unset NODE_OPTIONS
unset NODE_PATH
export NODE_OPTIONS=""
bun dev &
FRONTEND_PID=$!
cd ../..

echo ""
echo "✅ Servers running:"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8000"
echo "📖 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop"

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    # Also kill by port as backup
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

trap cleanup INT
wait