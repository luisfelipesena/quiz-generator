import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, type AnswerRequest, type AnswerResponse, type QuizResponse, ApiError } from '@/lib/api'
import { useQuizStore } from '@/stores/quiz-store'
import { useSessionId } from './useSessionId'

/**
 * Hook for handling PDF upload and quiz generation
 */
export function useUploadPdfMutation() {
  const { setQuiz, setCurrentStep } = useQuizStore()
  const sessionId = useSessionId()
  
  return useMutation<QuizResponse, ApiError, File>({
    mutationFn: async (file: File) => {
      return api.uploadPdfAndGenerateQuiz(file, sessionId)
    },
    onMutate: () => {
      // Only change to generating state when mutation actually starts
      setCurrentStep('generating')
    },
    onSuccess: (data: QuizResponse) => {
      setQuiz(data.quiz_title, data.questions)
      setCurrentStep('edit')
    },
    onError: (error: ApiError) => {
      console.error('PDF upload failed:', error)
      setCurrentStep('upload')
      
      let userMessage = 'Failed to generate quiz. Please try again.'
      
      if (error.message.includes('OpenAI')) {
        userMessage = 'AI service temporarily unavailable. Please try again.'
      } else if (error.message.includes('PDF')) {
        userMessage = 'Error processing PDF. Please check if the file is valid.'
      } else if (error.status === 500) {
        userMessage = 'Server error. Please try again in a moment.'
      }
      
      toast.error(userMessage)
    },
  })
}

/**
 * Hook for checking quiz answers
 */
export function useCheckAnswerMutation() {
  return useMutation<AnswerResponse, ApiError, AnswerRequest>({
    mutationFn: (answerRequest: AnswerRequest) => api.checkAnswer(answerRequest),
    onError: (error: ApiError) => {
      console.error('Answer check failed:', error)
      
      let errorMessage = 'Failed to check answer. Please try again.'
      if (error.status === 404) {
        errorMessage = 'Question not found. Please refresh and try again.'
      } else if (error.status === 500) {
        errorMessage = 'Server error while checking answer. Please try again.'
      }
      
      toast.error(errorMessage)
    },
  })
}

/**
 * Combined hook for quiz-taking workflow
 */
export function useQuizAnswer() {
  const { questions, submitAnswer } = useQuizStore()
  const checkAnswerMutation = useCheckAnswerMutation()

  const checkAnswer = async (questionId: string, userAnswer: string) => {
    const answerRequest: AnswerRequest = {
      question_id: questionId,
      user_answer: userAnswer,
      questions,
    }
    
    const result = await checkAnswerMutation.mutateAsync(answerRequest)
    submitAnswer(questionId, userAnswer, result)
    return result
  }

  return {
    checkAnswer,
    isLoading: checkAnswerMutation.isPending,
    error: checkAnswerMutation.error,
    reset: checkAnswerMutation.reset,
  }
} 