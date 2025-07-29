#!/bin/bash

# Change to the project root directory
cd "$(dirname "$0")/.."

echo "⚛️ Starting Frontend Server..."

cd apps/frontend

# Clear any Node.js debug configurations
unset NODE_OPTIONS
unset NODE_PATH
export NODE_OPTIONS=""

# Kill existing process on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Start Next.js development server
bun dev