# 🧪 Oleve Take-Home Project: AI-Powered PDF Quiz Generator

## 🎯 Objective

Build a web application that lets a user upload a PDF, generates 10 questions and answers based on the content using the OpenAI API, allows editing those questions, and lets the user take a quiz with scoring and feedback.

---

## 🛠️ Tech Stack

You must use the following technologies:

- **Frontend**: React with **Next.js App Router**
- **Backend**: **FastAPI**
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [React Query](https://tanstack.com/query/latest)
- **AI Integration**: OpenAI or Claude
- AI use (Cursor, Co-pilot) is permitted

You may use any additional libraries you'd like for styling (e.g., Tailwind, CSS Modules, Chakra UI).

---

🎨 Figma: Provided in the email

---

## 🔄 User Flow

1. **Upload PDF**
    - The user uploads a PDF file.
    - The backend extracts the text from the PDF and sends it to ChatGPT to generate 10 question/answer pairs.
2. **Edit Questions**
    - The user can review and edit the generated questions and answers before starting the quiz.
3. **Take Quiz**
    - The user goes through each question.
    - When they answer, they receive immediate feedback (correct/incorrect).
    - For incorrect answers, show the correct one.
4. **View Score**
    - At the end of the quiz, display the user’s score (e.g. 7/10).
    - Optionally, summarize correct vs. incorrect answers.

---

## ✏️ Requirements

You are responsible for designing the UI and UX. This includes:

- **Page layout and flow**
- **Error handling (e.g. file too large, API failure, empty PDF, etc.)**
- **Loading states, feedback, and data validation**
- Complete missing UX/UI if any

We will provide a **Figma file** for visual inspiration, but you are encouraged to make UI/UX decisions where appropriate.

---

## 📁 Expectations

We will evaluate your submission based on:

| Category | What We're Looking For |
| --- | --- |
| **Functionality** | App works end-to-end |
| **React Query Usage** | Good handling of API state, caching, loading/errors |
| **Zustand Usage** | Proper use of state management (if needed) |
| **Error Handling** | User-friendly error messaging and edge case coverage |
| **Code Quality** | Clean, well-structured code with thoughtful naming |
| **UI/UX** | Usable, clear, responsive interface |

---

## ✨ Stretch Goals

These are optional but will impress:

- 📱 **Mobile Friendly** – Ensure the app works well on mobile devices
- 🌀 **Animation** – Add subtle transitions (e.g. quiz step transitions, feedback states)
- 💬 **Streaming Feedback** – Use OpenAI/Claude’s streaming API to show explanations when a user answers incorrectly
- 💾 **Persistence** – Save edited questions to local storage or backend

---

## 🔗 Submission Guidelines

- Please share a GitHub repo (public or invite us).
- Include a `README.md` with setup instructions.
- Bonus if you deploy your app (e.g., Vercel, Render, [Fly.io](http://fly.io/)) – but this is not required.

---

## 🧠 Notes

- Use your judgment for file and folder structure — we’re evaluating your ability to make architectural decisions.

---

Happy building!