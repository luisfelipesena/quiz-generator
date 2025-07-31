import { useMutation } from '@tanstack/react-query'
import { api, type AnswerRequest, type AnswerResponse, type QuizResponse, ApiError } from '@/lib/api'
import { useQuizStore } from '@/stores/quiz-store'

/**
 * Hook for handling PDF upload and quiz generation
 */
export function useUploadPdfMutation() {
  const { setQuestions, setCurrentStep } = useQuizStore()
  
  return useMutation<QuizResponse, ApiError, File>({
    mutationFn: async (file: File) => {
      // Start generating step immediately
      setCurrentStep('generating')
      return api.uploadPdfAndGenerateQuiz(file)
    },
    onSuccess: (data: QuizResponse) => {
      setQuestions(data.questions)
      // Show success for a moment, then transition to edit
      setTimeout(() => {
        setCurrentStep('edit')
      }, 1500)
    },
    onError: (error: ApiError) => {
      console.error('PDF upload failed:', error)
      // Return to upload step on error
      setCurrentStep('upload')
      
      // Show user-friendly error message
      let userMessage = 'Failed to generate quiz. Please try again.'
      
      if (error.message.includes('OpenAI')) {
        userMessage = 'AI service temporarily unavailable. Please try again.'
      } else if (error.message.includes('PDF')) {
        userMessage = 'Error processing PDF. Please check if the file is valid.'
      } else if (error.status === 500) {
        userMessage = 'Server error. Please try again in a moment.'
      }
      
      // You could show this message in a toast notification
      // For now, we'll log it
      console.warn('User-friendly error:', userMessage)
    },
  })
}

/**
 * Hook for checking quiz answers
 */
export function useCheckAnswerMutation() {
  return useMutation<AnswerResponse, ApiError, AnswerRequest>({
    mutationFn: api.checkAnswer,
    onError: (error: ApiError) => {
      console.error('Answer check failed:', error)
    },
  })
}

/**
 * Combined hook for quiz-taking workflow
 */
export function useQuizAnswer() {
  const { submitAnswer } = useQuizStore()
  const checkAnswerMutation = useCheckAnswerMutation()

  const checkAnswer = (questionId: string, userAnswer: string) => {
    const answerRequest: AnswerRequest = {
      question_id: questionId,
      user_answer: userAnswer,
    }
    
    return checkAnswerMutation.mutateAsync(answerRequest).then((result) => {
      submitAnswer(questionId, userAnswer, result)
      return result
    })
  }

  return {
    checkAnswer,
    isLoading: checkAnswerMutation.isPending,
    error: checkAnswerMutation.error,
    reset: checkAnswerMutation.reset,
  }
} 