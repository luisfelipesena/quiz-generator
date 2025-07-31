import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { type QuestionAnswer, type AnswerResponse, type QuestionUpdateRequest, api } from '@/lib/api'

export type QuizStep = 'upload' | 'generating' | 'edit' | 'preparing' | 'quiz' | 'results'

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
  quizTitle: string
  
  // User information
  userName: string
  
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
  setUserName: (name: string) => void
  setQuiz: (title: string, questions: QuestionAnswer[]) => void
  updateQuestion: (questionId: string, questionUpdate: QuestionUpdateRequest, sessionId?: string) => void
  
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
      quizTitle: '',
      userName: '',
      questions: [],
      editedQuestions: {},
      currentQuestionIndex: 0,
      answers: [],
      showFeedback: false,

      // Actions
      setCurrentStep: (step) => {
        const { questions } = get()
        // Prevent navigation to quiz step if no questions available
        if (step === 'quiz' && questions.length === 0) {
          console.warn('Cannot navigate to quiz: No questions available')
          set({ currentStep: 'upload' })
          return
        }
        set({ currentStep: step })
      },
      setUserName: (name) => set({ userName: name }),
      
      setQuiz: (title, questions) => set({
        quizTitle: title,
        questions,
        editedQuestions: {},
        currentQuestionIndex: 0,
        answers: [],
      }),
      
      updateQuestion: async (questionId, questionUpdate, sessionId) => {
        // Update local state immediately for optimistic updates
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
        }))
        
        // Sync with backend if sessionId is provided
        if (sessionId) {
          try {
            await api.updateQuestion(questionId, questionUpdate, sessionId)
          } catch (error) {
            console.error('Failed to sync question update to backend:', error)
            // The local state is already updated, so this is just for backend sync
          }
        }
      },

      startQuiz: () => {
        const { questions } = get()
        // Only start quiz if there are questions available
        if (questions.length > 0) {
          set({
            currentStep: 'quiz',
            currentQuestionIndex: 0,
            answers: [],
            showFeedback: false,
          })
        } else {
          console.warn('Cannot start quiz: No questions available')
          // Redirect back to upload step if no questions
          set({ currentStep: 'upload' })
        }
      },

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
          quizTitle: '',
          userName: '',
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
          quizTitle: state.quizTitle,
          userName: state.userName,
        }),
      }
    ),
    {
      name: 'quiz-store-devtools',
    }
  )
)