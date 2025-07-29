# 🧪 AI-Powered PDF Quiz Generator

An interactive web application that generates quiz questions from PDF documents using AI, allowing users to test their knowledge and receive immediate feedback.

## 🎯 Features

- **PDF Upload**: Drag-and-drop PDF file upload with validation
- **AI Question Generation**: Automatically generates 10 quiz questions using OpenAI GPT
- **Question Editing**: Review and edit generated questions before taking the quiz
- **Interactive Quiz**: Multiple-choice questions with immediate feedback
- **Scoring System**: Real-time scoring with detailed results breakdown
- **Mobile Responsive**: Works seamlessly on all devices

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** (App Router) with React 19
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **shadcn/ui** components
- **Zustand** for state management
- **React Query (TanStack Query)** for API state management
- **Zod** for schema validation
- **React Hook Form** for form handling

### Backend
- **FastAPI** with Python
- **OpenAI API** for question generation
- **PyPDF2** for PDF text extraction
- **Pydantic** for data validation
- **CORS middleware** for cross-origin requests

## 📁 Project Structure

```
quiz-generator/
├── apps/
│   ├── frontend/          # Next.js application
│   │   ├── src/
│   │   │   ├── app/       # App router pages
│   │   │   ├── components/ # UI components
│   │   │   ├── lib/       # Utilities and API client
│   │   │   ├── providers/ # React Query provider
│   │   │   └── stores/    # Zustand stores
│   │   └── package.json
│   └── backend/           # FastAPI application
│       ├── main.py        # FastAPI app
│       ├── requirements.txt
│       └── venv/          # Python virtual environment
├── package.json           # Monorepo root
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Bun** (latest version) - [Install Bun](https://bun.sh)
- **Python 3.11+** - [Install Python](https://python.org)
- **OpenAI API Key** - [Get API Key](https://platform.openai.com/api-keys)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd quiz-generator
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Set up environment variables**:
   Create `.env` files in each app directory:
   ```bash
   # apps/backend/.env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   
   # apps/frontend/.env.local
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Set up Python virtual environment and install backend dependencies**:
   ```bash
   python3 -m venv apps/backend/venv
   source apps/backend/venv/bin/activate  # On Windows: apps\\backend\\venv\\Scripts\\activate
   pip install -r apps/backend/requirements.txt
   ```

### Development

You have several options to start the development servers:

#### Option 1: Start both servers together
```bash
bun dev
# or
./scripts/start-servers.sh
```

#### Option 2: Start servers individually
**Backend** (in one terminal):
```bash
bun run dev:backend
# or
./scripts/run-backend.sh
```

**Frontend** (in another terminal):
```bash
bun run dev:frontend
# or
./scripts/run-frontend.sh
```

#### Option 3: Manual startup
**Backend** (in one terminal):
```bash
cd apps/backend
source venv/bin/activate
python -m fastapi dev main.py --reload
```

**Frontend** (in another terminal):
```bash
cd apps/frontend
NODE_OPTIONS="" bun dev
```

The servers will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Building for Production

1. **Build the frontend**:
   ```bash
   cd apps/frontend
   bun run build
   ```

2. **Start production servers**:
   ```bash
   # Backend (in production mode)
   source apps/backend/venv/bin/activate
   cd apps/backend
   python -m fastapi run main.py
   
   # Frontend (in another terminal)
   cd apps/frontend
   bun start
   ```

## 🧪 Testing the Application

### Basic Test Flow

1. **Upload a PDF**: 
   - Navigate to http://localhost:3000
   - Drag and drop a PDF file or click to select one
   - The system will extract text and generate questions using AI

2. **Edit Questions** (optional):
   - Review the generated questions
   - Edit any questions, answers, or options as needed
   - Click "Start Quiz" when ready

3. **Take the Quiz**:
   - Answer each multiple-choice question
   - Receive immediate feedback after each answer
   - Progress through all 10 questions

4. **View Results**:
   - See your final score and percentage
   - Review detailed breakdown of each question
   - See correct answers for questions you got wrong

### API Testing

You can also test the API endpoints directly:

- **API Documentation**: http://localhost:8000/docs (FastAPI automatic docs)
- **Upload PDF**: POST http://localhost:8000/upload-pdf
- **Check Answer**: POST http://localhost:8000/check-answer
- **Update Question**: PUT http://localhost:8000/questions/{question_id}

## 🔧 Configuration

### OpenAI Configuration

The application uses GPT-3.5-turbo by default. You can modify the model in `apps/backend/main.py`:

```python
response = client.chat.completions.create(
    model="gpt-3.5-turbo",  # Change to "gpt-4" for better quality
    messages=[...],
    temperature=0.7
)
```

### CORS Configuration

CORS is configured to allow requests from `http://localhost:3000`. For production, update the `allow_origins` in `apps/backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-domain.com"],  # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Connect your GitHub repository to Vercel**
2. **Set build settings**:
   - Build Command: `cd apps/frontend && bun run build`
   - Output Directory: `apps/frontend/.next`
   - Install Command: `bun install`
3. **Set environment variables**:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL

### Backend Deployment (Railway/Render/Fly.io)

1. **Create a `Dockerfile` in `apps/backend/`**:
   ```dockerfile
   FROM python:3.11-slim
   
   WORKDIR /app
   
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   
   COPY . .
   
   EXPOSE 8000
   
   CMD ["python", "-m", "fastapi", "run", "main.py", "--host", "0.0.0.0", "--port", "8000"]
   ```

2. **Set environment variables** in your deployment platform:
   - `OPENAI_API_KEY`: Your OpenAI API key

### Full-Stack Deployment

For a complete deployment, consider using:
- **Vercel** for frontend + **Railway** for backend
- **Netlify** for frontend + **Render** for backend
- **Docker Compose** for both services

## 📚 Next Steps for Validation

### Functional Testing

1. **PDF Processing**:
   - Test with various PDF types (text-based, scanned, complex layouts)
   - Test with different file sizes (small, medium, large)
   - Test error handling for corrupted or empty PDFs

2. **Question Generation**:
   - Verify questions are relevant to PDF content
   - Check question quality and clarity
   - Test with different content types (academic, technical, narrative)

3. **Quiz Functionality**:
   - Test all multiple-choice interactions
   - Verify answer validation works correctly
   - Check scoring calculations

4. **User Experience**:
   - Test on different devices and screen sizes
   - Verify loading states and error messages
   - Test complete user flow multiple times

### Performance Testing

1. **Load Testing**:
   - Test with multiple concurrent users
   - Monitor API response times
   - Test with large PDF files

2. **Frontend Performance**:
   - Check bundle size and loading times
   - Test React Query caching behavior
   - Monitor memory usage during quiz sessions

### Security Testing

1. **File Upload Security**:
   - Test file type validation
   - Test file size limits
   - Verify malicious file handling

2. **API Security**:
   - Test CORS configuration
   - Verify input validation
   - Test rate limiting (if implemented)

## 🐛 Troubleshooting

### Common Issues

1. **VS Code/Cursor Debugger Conflicts**: 
   - If you see Node.js debugger errors, use the provided scripts: `./scripts/start-servers.sh`
   - Or use bun commands: `bun dev`, `bun run dev:frontend`, `bun run dev:backend`
   - Or manually set `NODE_OPTIONS=""` before running commands
   - Kill existing processes: `lsof -ti:3000 | xargs kill -9` and `lsof -ti:8000 | xargs kill -9`

2. **Build errors**: 
   - Make sure you have the latest version of Bun and Node.js
   - Clear Node modules and reinstall: `rm -rf node_modules && bun install`

3. **API connection issues**: 
   - Verify CORS settings in `apps/backend/main.py`
   - Check environment variables are set correctly
   - Ensure backend is running on http://localhost:8000

4. **OpenAI API errors**: 
   - Check your API key is valid and has sufficient quota
   - Verify the key is set in both `.env` and `apps/backend/.env`

5. **PDF extraction issues**: 
   - Some PDFs may not extract text properly (scanned images, complex layouts)
   - Try with different PDF files that contain selectable text
   - Check file size limits

### Development Tips

- Use the React Query DevTools to debug API calls
- Check the FastAPI automatic docs at `/docs` for API testing
- Use the browser dev tools to monitor network requests
- Check both frontend and backend logs for error details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure build passes
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).