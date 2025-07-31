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
├── package.json           # Monorepo root
├── vercel.json            # Vercel deployment config
├── render.yaml            # Render deployment config
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Bun** (latest version) - [Install Bun](https://bun.sh)
- **Python 3.11+** - [Install Python](https://python.org)
- **OpenAI API Key** - [Get API Key](https://platform.openai.com/api-keys)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd quiz-generator
    ```

2.  **Install dependencies**:
    ```bash
    bun install
    ```

3.  **Set up environment variables**:
    Create `.env` files in each app directory:
    ```bash
    # apps/backend/.env
    OPENAI_API_KEY=sk-your-openai-api-key-here
    
    # apps/frontend/.env
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```

4.  **Set up Python virtual environment and install backend dependencies**:
    ```bash
    python3 -m venv apps/backend/venv
    source apps/backend/venv/bin/activate  # On Windows: apps\\backend\\venv\\Scripts\\activate
    pip install -r apps/backend/requirements.txt
    ```

### Development

Start both servers together:
```bash
bun dev
```

The servers will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 🚀 Deployment

This project is configured for **Continuous Deployment** on Vercel (frontend) and Render (backend).

**The deployment process is fully automated:**

1.  **Commit your changes** to the `main` branch.
2.  **Push to GitHub**:
    ```bash
    git push origin main
    ```
3.  **Vercel** and **Render** will automatically detect the push, build, and deploy the latest version of the frontend and backend, respectively.

### Initial Setup on Vercel & Render

You only need to do this once.

#### Frontend (Vercel)
1.  Import your GitHub repository to Vercel.
2.  Set the **Root Directory** to `apps/frontend`. Vercel will automatically use the `vercel.json` file for the rest of the configuration.
3.  Add the `NEXT_PUBLIC_API_URL` environment variable and point it to your Render backend URL.

#### Backend (Render)
1.  Create a new Web Service on Render and connect your GitHub repository.
2.  Render will automatically use the `render.yaml` file to configure the service.
3.  Add your `OPENAI_API_KEY` as a secret environment variable.

### Deployment Files
- ✅ `vercel.json` - Vercel configuration
- ✅ `render.yaml` - Render service configuration

### Free Tier Limitations

- **Vercel (Free)**: Generous limits for hobby projects.
- **Render (Free)**: Services sleep after 15 minutes of inactivity and may have a 10-30 second cold start.

## 🐛 Troubleshooting

### Common Issues
1.  **VS Code/Cursor Debugger Conflicts**: If you see Node.js debugger errors, use `bun dev`.
2.  **Build errors**: Make sure you have the latest version of Bun. Clear node modules and reinstall: `rm -rf node_modules && bun install`.
3.  **API connection issues**: Verify CORS settings in `apps/backend/main.py` and check environment variables.
4.  **OpenAI API errors**: Check your API key is valid and has sufficient quota.
5.  **PDF extraction issues**: Some PDFs (e.g., scanned images) may not extract text properly. Use PDFs with selectable text.

### Development Tips
- Use the React Query DevTools to debug API calls.
- Check the FastAPI automatic docs at `/docs` for API testing.
- Use the browser dev tools to monitor network requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
