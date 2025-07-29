# 📝 Development Scripts

This directory contains scripts to help with development and testing of the Quiz Generator application.

## 🚀 Available Scripts

### `start-servers.sh`
**Main development script** - Starts both frontend and backend servers together.

```bash
./scripts/start-servers.sh
# or via bun
bun dev
```

- Cleans up existing processes on ports 3000 and 8000
- Starts FastAPI backend server in development mode
- Starts Next.js frontend server with optimized Node.js configuration
- Provides cleanup on Ctrl+C

### `run-frontend.sh`
Starts **only the frontend** Next.js development server.

```bash
./scripts/run-frontend.sh
# or via bun
bun run dev:frontend
```

- Clears Node.js debug configurations to avoid conflicts
- Kills any existing process on port 3000
- Starts Next.js with `bun dev`

### `run-backend.sh`
Starts **only the backend** FastAPI development server.

```bash
./scripts/run-backend.sh
# or via bun
bun run dev:backend
```

- Kills any existing process on port 8000
- Activates Python virtual environment
- Starts FastAPI with hot reload enabled

### `test-app.sh`
**Comprehensive testing script** that validates the entire application setup.

```bash
./scripts/test-app.sh
# or via bun
bun run test
```

Tests performed:
- ✅ Python virtual environment exists
- ✅ Environment files are configured
- ✅ Frontend builds successfully
- ✅ Backend dependencies are installed
- ⚠️ Checks if OpenAI API key needs to be updated

### `start-dev.sh`
**Legacy development script** - Alternative startup method with additional validation.

```bash
./scripts/start-dev.sh
```

Similar to `start-servers.sh` but with more detailed startup checks and messaging.

## 🔧 How Scripts Work

All scripts are designed to:

1. **Change to project root** - Scripts can be run from anywhere and will navigate to the correct directory
2. **Handle path resolution** - Use `$(dirname "$0")/..` to find the project root
3. **Clean up processes** - Kill existing processes on development ports to avoid conflicts
4. **Set proper environment** - Clear Node.js debug configurations that might conflict

## 💡 Usage Tips

### Running from any directory
```bash
# From project root
./scripts/start-servers.sh

# From scripts directory
cd scripts && ./start-servers.sh

# From anywhere using bun
bun dev
```

### Debugging issues
If you encounter problems:

1. **Check script permissions**:
   ```bash
   chmod +x scripts/*.sh
   ```

2. **Kill existing processes manually**:
   ```bash
   lsof -ti:3000 | xargs kill -9  # Kill frontend
   lsof -ti:8000 | xargs kill -9  # Kill backend
   ```

3. **Clear Node.js environment**:
   ```bash
   unset NODE_OPTIONS
   unset NODE_PATH
   ```

4. **Run test script** to validate setup:
   ```bash
   bun run test
   ```

### Environment Requirements

Before running any development script, ensure:

- Python virtual environment is created: `python3 -m venv apps/backend/venv`
- Backend dependencies installed: `pip install -r apps/backend/requirements.txt`
- OpenAI API key is set in `.env` files
- Bun dependencies installed: `bun install`

## 🔄 Quick Start Workflow

1. **First time setup**:
   ```bash
   bun install
   python3 -m venv apps/backend/venv
   source apps/backend/venv/bin/activate
   pip install -r apps/backend/requirements.txt
   ```

2. **Add your OpenAI API key** to `.env` and `apps/backend/.env`

3. **Test everything works**:
   ```bash
   bun run test
   ```

4. **Start development**:
   ```bash
   bun dev
   ```

That's it! Your Quiz Generator will be running at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs