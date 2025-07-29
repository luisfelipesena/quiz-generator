#!/bin/bash

# Change to the project root directory
cd "$(dirname "$0")/.."

echo "🧪 Testing Quiz Generator Application..."
echo "======================================"

# Test backend virtual environment
if [ ! -d "apps/backend/venv" ]; then
    echo "❌ Backend virtual environment not found"
    echo "Please run: python3 -m venv apps/backend/venv"
    echo "Then: source apps/backend/venv/bin/activate && pip install -r apps/backend/requirements.txt"
    exit 1
else
    echo "✅ Backend virtual environment found"
fi

# Test environment files
if [ ! -f ".env" ]; then
    echo "❌ .env file not found"
    echo "Please create .env with your OpenAI API key"
    exit 1
elif grep -q "sk-<your-openai-api-key-here>" .env; then
    echo "⚠️  Environment file found but OpenAI API key needs to be updated"
    echo "Please replace 'sk-<your-openai-api-key-here>' with your actual OpenAI API key"
else
    echo "✅ Environment file found with API key"
fi

# Test frontend build
echo "📦 Testing frontend build..."
cd apps/frontend
NODE_OPTIONS="" bun run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Frontend builds successfully"
else
    echo "❌ Frontend build failed"
    exit 1
fi
cd ../..

# Test backend dependencies
echo "🐍 Testing backend dependencies..."
source apps/backend/venv/bin/activate
python -c "import fastapi, openai, PyPDF2" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies are installed"
else
    echo "❌ Backend dependencies missing"
    echo "Please run: pip install -r apps/backend/requirements.txt"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Your application is ready to run."
echo ""
echo "To start the application:"
echo "1. Make sure you have your OpenAI API key in the .env files"
echo "2. Run: ./scripts/start-servers.sh"
echo "3. Or run servers individually:"
echo "   - Backend: ./scripts/run-backend.sh"
echo "   - Frontend: ./scripts/run-frontend.sh"
echo ""
echo "Servers will be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend: http://localhost:8000"