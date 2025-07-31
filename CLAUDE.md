# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Monorepo Development
- **Start both servers**: `bun dev` (runs frontend on :3000, backend on :8000)
- **Frontend only**: `bun run dev:frontend` 
- **Backend only**: `bun run dev:backend` (requires activated Python venv)
- **Clean ports**: `bun run clean:ports` (kills processes on ports 3000/8000)

### Building & Testing
- **Build everything**: `bun run build`
- **Test everything**: `bun test` (includes environment checks)
- **Lint everything**: `bun run lint`
- **Type check**: `bun run type-check`

### Frontend Commands (apps/frontend)
- **Development**: `bun dev` (uses Turbopack)
- **Build**: `bun run build`
- **Lint**: `bun run lint` (ESLint with Next.js config)
- **Type check**: `bunx tsc --noEmit`

### Backend Commands (apps/backend)
- **Development**: `python -m fastapi dev main.py --reload --port 8000`
- **Production**: `python -m fastapi run main.py --port 8000`
- **Lint**: `ruff check .`
- **Format**: `ruff format .`
- **Type check**: `mypy . --ignore-missing-imports`

### Environment Setup
- **Backend Python venv**: `python3 -m venv apps/backend/venv && source apps/backend/venv/bin/activate && pip install -r apps/backend/requirements.txt`
- **Check dependencies**: `bun run check:deps`

### Testing Commands
- **E2E Tests (Complete)**: `python3 test_e2e_complete.py` (Selenium-based, comprehensive)
- **E2E Tests (Playwright)**: `bun run test:e2e` (Modern browser automation)
- **API Tests Only**: `python3 test_quiz_complete.py` (Backend validation)
- **Visual Tests**: `./visual_test_script.sh` (Screenshots across viewports)
- **Test Report**: `bun run test:e2e:report` (View Playwright HTML report)

## Project Architecture

### High-Level Architecture
This is a monorepo with a Next.js frontend and FastAPI backend for an AI-powered PDF quiz generator:

- **Frontend (apps/frontend)**: Next.js 15 with React 19, TypeScript, Tailwind CSS v4
- **Backend (apps/backend)**: FastAPI with Python, OpenAI integration, PDF processing
- **State Management**: Zustand for client state, React Query for server state
- **API Integration**: Fully typed API client with Zod schemas matching backend DTOs

### Frontend Architecture

#### State Management Pattern
- **Zustand Store**: `src/stores/quiz-store.ts` - Central state for quiz flow (`upload` → `edit` → `quiz` → `results`)
- **React Query**: API state management with caching and error handling
- **Persistence**: Quiz questions and edits persisted to localStorage

#### Component Structure
- **Feature Components**: `src/components/features/` (pdf-upload, question-editor, quiz, quiz-results)
- **UI Components**: `src/components/ui/` (shadcn/ui components)
- **API Layer**: `src/lib/api.ts` - Typed API client with Zod validation

#### Key Frontend Files
- `src/stores/quiz-store.ts`: Central state management with quiz flow steps
- `src/lib/api.ts`: Fully typed API client with error handling
- `src/hooks/useQuizMutations.ts`: React Query mutations for quiz operations
- `src/providers/query-provider.tsx`: React Query configuration

### Backend Architecture

#### Clean Architecture Pattern
The backend follows a clean architecture with clear separation:

- **API Layer**: Route handlers in `src/*/api.py` files
- **Service Layer**: Business logic in `src/*/services.py` files  
- **DTO Layer**: Data validation in `src/*/dto.py` files

#### Module Structure
- **Quiz Module** (`src/quiz/`): Question generation and answer checking
- **PDF Module** (`src/pdf/`): PDF text extraction
- **Common Module** (`src/common/`): Health checks and shared utilities

#### Key Backend Files
- `main.py`: FastAPI app with CORS and router registration
- `src/quiz/services.py`: OpenAI integration for question generation
- `src/quiz/api.py`: Quiz endpoints (`/quiz/upload-pdf`, `/quiz/check-answer`)
- `src/pdf/services.py`: PDF text extraction using PyPDF2

### API Design
The API uses a consistent pattern:
- **Request/Response DTOs**: Pydantic models for validation
- **Error Handling**: Structured error responses
- **Dependencies**: Dependency injection for services
- **Type Safety**: Zod schemas on frontend match Pydantic models on backend

### Technology Stack Details

#### Frontend Stack
- **Next.js 15**: App Router, TypeScript, React 19
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **State**: Zustand + React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation
- **File Handling**: react-dropzone for PDF uploads

#### Backend Stack  
- **FastAPI**: Async Python web framework
- **AI Integration**: OpenAI GPT-3.5-turbo for question generation
- **PDF Processing**: PyPDF2 for text extraction
- **Validation**: Pydantic models for request/response validation

## Development Workflow

### Environment Variables Required
- **Backend**: `OPENAI_API_KEY` in `apps/backend/.env`
- **Frontend**: `NEXT_PUBLIC_API_URL` in `apps/frontend/.env` (defaults to http://localhost:8000)

### Common Issues
- **Port conflicts**: Use `bun run clean:ports` to kill existing processes
- **Python venv**: Always activate venv before running backend commands
- **NODE_OPTIONS**: Use provided scripts or manually set `NODE_OPTIONS=""` for Bun compatibility

### Testing Strategy
- **Frontend**: No test framework configured yet
- **Backend**: pytest setup available but not fully implemented
- **Integration**: Manual testing via API docs at `/docs`

### Deployment
- **Frontend**: Vercel deployment configured
- **Backend**: Render deployment configured
- **Scripts**: `bun run deploy` for automated deployment process