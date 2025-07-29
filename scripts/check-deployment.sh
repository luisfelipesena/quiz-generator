#!/bin/bash

# Quiz Generator - Deployment Readiness Check
# Verifies that all deployment files and configurations are in place

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if file exists
check_file() {
    if [ -f "$1" ]; then
        print_success "Found: $1"
        return 0
    else
        print_error "Missing: $1"
        return 1
    fi
}

# Check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        print_success "Found directory: $1"
        return 0
    else
        print_error "Missing directory: $1"
        return 1
    fi
}

# Main check function
main() {
    echo "🔍 Quiz Generator - Deployment Readiness Check"
    echo "=============================================="
    echo ""

    local errors=0

    # Check deployment configuration files
    print_info "Checking deployment configuration files..."
    check_file "vercel.json" || ((errors++))
    check_file "render.yaml" || ((errors++))
    check_file "apps/backend/Dockerfile" || ((errors++))
    check_file "apps/backend/.dockerignore" || ((errors++))
    echo ""

    # Check scripts
    print_info "Checking deployment scripts..."
    check_file "scripts/deploy.sh" || ((errors++))
    if [ -f "scripts/deploy.sh" ]; then
        if [ -x "scripts/deploy.sh" ]; then
            print_success "Deploy script is executable"
        else
            print_warning "Deploy script is not executable (run: chmod +x scripts/deploy.sh)"
        fi
    fi
    echo ""

    # Check environment examples
    print_info "Checking environment example files..."
    check_file "apps/frontend/env.example" || ((errors++))
    check_file "apps/backend/env.example" || ((errors++))
    echo ""

    # Check project structure
    print_info "Checking project structure..."
    check_dir "apps/frontend" || ((errors++))
    check_dir "apps/backend" || ((errors++))
    check_dir "apps/frontend/src" || ((errors++))
    check_dir "apps/backend/src" || ((errors++))
    echo ""

    # Check key files
    print_info "Checking key application files..."
    check_file "apps/frontend/package.json" || ((errors++))
    check_file "apps/backend/requirements.txt" || ((errors++))
    check_file "apps/backend/main.py" || ((errors++))
    check_file "apps/frontend/src/app/page.tsx" || ((errors++))
    echo ""

    # Check package.json scripts
    print_info "Checking package.json deployment scripts..."
    if [ -f "package.json" ]; then
        if grep -q '"deploy"' package.json; then
            print_success "Deploy script found in package.json"
        else
            print_error "Deploy script missing in package.json"
            ((errors++))
        fi
        
        if grep -q '"build"' package.json; then
            print_success "Build script found in package.json"
        else
            print_error "Build script missing in package.json"
            ((errors++))
        fi
    else
        print_error "Root package.json not found"
        ((errors++))
    fi
    echo ""

    # Check git status
    print_info "Checking git status..."
    if command -v git &> /dev/null; then
        if [ -d ".git" ]; then
            print_success "Git repository found"
            
            # Check if there are uncommitted changes
            if git diff-index --quiet HEAD --; then
                print_success "No uncommitted changes"
            else
                print_warning "You have uncommitted changes"
            fi
        else
            print_error "Not a git repository"
            ((errors++))
        fi
    else
        print_warning "Git not installed"
    fi
    echo ""

    # Final summary
    echo "📊 DEPLOYMENT READINESS SUMMARY"
    echo "================================"
    
    if [ $errors -eq 0 ]; then
        print_success "🎉 All checks passed! Your project is ready for deployment."
        echo ""
        print_info "Next steps:"
        echo "  1. Push your code to GitHub"
        echo "  2. Run: bun run deploy"
        echo "  3. Follow the deployment instructions"
        echo ""
        print_info "Or deploy manually:"
        echo "  • Frontend: https://vercel.com/dashboard"
        echo "  • Backend:  https://dashboard.render.com"
    else
        print_error "❌ Found $errors issue(s). Please fix them before deploying."
        echo ""
        print_info "Run this script again after fixing the issues."
    fi
    
    echo ""
    echo "🔗 Useful links:"
    echo "  • Vercel Dashboard: https://vercel.com/dashboard"
    echo "  • Render Dashboard: https://dashboard.render.com"
    echo "  • Project Documentation: README.md"
    
    return $errors
}

# Run main function
main "$@" 