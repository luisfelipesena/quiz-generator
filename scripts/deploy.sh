#!/bin/bash

# Quiz Generator - Deploy Script
# Deploys frontend to Vercel and backend to Render

set -e

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v bun &> /dev/null; then
        print_error "Bun is not installed. Please install Bun first."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed."
        exit 1
    fi
    
    print_status "Dependencies check passed"
}

# Build and test locally
build_and_test() {
    print_status "Building and testing locally..."
    
    # Install dependencies
    print_status "Installing dependencies..."
    bun install
    
    # Build frontend
    print_status "Building frontend..."
    cd apps/frontend
    bun run build
    cd ../..
    
    # Test backend (basic import test)
    print_status "Testing backend..."
    cd apps/backend
    if [ -d "venv" ]; then
        source venv/bin/activate
    fi
    python -c "from main import app; print('✅ Backend imports successfully')"
    cd ../..
    
    print_status "Build and test completed successfully"
}

# Deploy to platforms
deploy() {
    print_status "Starting deployment..."
    
    # Commit current changes
    print_status "Committing changes..."
    git add .
    git commit -m "Deploy: $(date)" || print_warning "No new changes to commit"
    
    # Push to main branch
    print_status "Pushing to main branch..."
    git push origin main
    
    print_status "🎉 Code pushed to repository!"
    print_warning "Now complete these manual steps:"
    echo ""
    echo "📋 MANUAL DEPLOYMENT STEPS:"
    echo ""
    echo "🔹 VERCEL (Frontend):"
    echo "   1. Go to https://vercel.com/dashboard"
    echo "   2. Import your GitHub repository"
    echo "   3. Set Root Directory to: apps/frontend"
    echo "   4. Framework Preset: Next.js"
    echo "   5. Build Command: bun run build"
    echo "   6. Environment Variables:"
    echo "      NEXT_PUBLIC_API_URL=https://your-render-backend-url.onrender.com"
    echo ""
    echo "🔹 RENDER (Backend):"
    echo "   1. Go to https://dashboard.render.com"
    echo "   2. Create New Web Service"
    echo "   3. Connect your GitHub repository"
    echo "   4. Root Directory: apps/backend"
    echo "   5. Build Command: pip install -r requirements.txt"
    echo "   6. Start Command: python -m fastapi run main.py --host 0.0.0.0 --port \$PORT"
    echo "   7. Environment Variables:"
    echo "      OPENAI_API_KEY=your-openai-api-key"
    echo ""
    echo "🔗 After backend deploys, update frontend env with the Render URL!"
}

# Main execution
main() {
    echo "🧪 Quiz Generator - Deployment Script"
    echo "====================================="
    
    check_dependencies
    build_and_test
    deploy
    
    print_status "Deployment script completed! 🎉"
}

# Run main function
main "$@" 