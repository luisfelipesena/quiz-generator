import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { type QuestionAnswer, type AnswerResponse, type QuestionUpdateRequest } from '@/lib/api'

export type QuizStep = 'upload' | 'edit' | 'quiz' | 'results'

interface QuizAnswer {
  questionId: string
  userAnswer: string
  isCorrect: boolean
  correctAnswer: string
  explanation?: string
}

interface QuizState {
  // Current step in the quiz flow
  currentStep: QuizStep
  
  // Questions and editing
  questions: QuestionAnswer[]
  editedQuestions: Record<string, QuestionAnswer>
  
  // Quiz taking
  currentQuestionIndex: number
  answers: QuizAnswer[]
  showFeedback: boolean
}

interface QuizActions {
  // Actions
  setCurrentStep: (step: QuizStep) => void
  setQuestions: (questions: QuestionAnswer[]) => void
  updateQuestion: (questionId: string, questionUpdate: QuestionUpdateRequest) => void
  
  // Quiz actions
  startQuiz: () => void
  submitAnswer: (questionId: string, userAnswer: string, result: AnswerResponse) => void
  nextQuestion: () => void
  resetQuiz: () => void
  
  // Computed
  getScore: () => { correct: number; total: number; percentage: number }
  getCurrentQuestion: () => QuestionAnswer | null
  isQuizComplete: () => boolean
}

export const useQuizStore = create<QuizState & QuizActions>()(
  devtools(
    persist(
      (set, get) => ({
      // Initial state
      currentStep: 'upload',
      questions: [],
      editedQuestions: {},
      currentQuestionIndex: 0,
      answers: [],
      showFeedback: false,

      // Actions
      setCurrentStep: (step) => set({ currentStep: step }),
      
      setQuestions: (questions) => set({ 
        questions,
        editedQuestions: {},
        currentQuestionIndex: 0,
        answers: [],
      }),
      
      updateQuestion: (questionId, questionUpdate) =>
        set((state) => ({
          editedQuestions: {
            ...state.editedQuestions,
            [questionId]: {
              id: questionUpdate.id,
              question: questionUpdate.question,
              answer: questionUpdate.answer,
              options: questionUpdate.options,
            },
          },
        })),

      startQuiz: () =>
        set({
          currentStep: 'quiz',
          currentQuestionIndex: 0,
          answers: [],
          showFeedback: false,
        }),

      submitAnswer: (questionId, userAnswer, result) =>
        set((state) => ({
          answers: [
            ...state.answers,
            {
              questionId,
              userAnswer,
              isCorrect: result.correct,
              correctAnswer: result.correct_answer,
              explanation: result.explanation,
            },
          ],
          showFeedback: true,
        })),

      nextQuestion: () =>
        set((state) => {
          const nextIndex = state.currentQuestionIndex + 1
          const isComplete = nextIndex >= state.questions.length

          return {
            currentQuestionIndex: nextIndex,
            showFeedback: false,
            currentStep: isComplete ? 'results' : 'quiz',
          }
        }),

      resetQuiz: () =>
        set({
          currentStep: 'upload',
          questions: [],
          editedQuestions: {},
          currentQuestionIndex: 0,
          answers: [],
          showFeedback: false,
        }),

      // Computed functions
      getScore: () => {
        const { answers } = get()
        const correct = answers.filter((a) => a.isCorrect).length
        const total = answers.length
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0
        return { correct, total, percentage }
      },

      getCurrentQuestion: () => {
        const { questions, editedQuestions, currentQuestionIndex } = get()
        const question = questions[currentQuestionIndex]
        if (!question) return null
        
        // Return edited version if it exists, otherwise original
        return editedQuestions[question.id] || question
      },

      isQuizComplete: () => {
        const { questions, currentQuestionIndex } = get()
        return currentQuestionIndex >= questions.length
      },
    }),
      {
        name: 'quiz-store',
        // Only persist the essential state, not the computed functions
        partialize: (state) => ({
          editedQuestions: state.editedQuestions,
          questions: state.questions,
        }),
      }
    ),
    {
      name: 'quiz-store-devtools',
    }
  )
)