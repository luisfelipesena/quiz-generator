import { useMutation } from '@tanstack/react-query'
import { api, type AnswerRequest, type AnswerResponse, type QuizResponse, ApiError } from '@/lib/api'
import { useQuizStore } from '@/stores/quiz-store'

/**
 * Hook for handling PDF upload and quiz generation
 */
export function useUploadPdfMutation() {
  const { setQuestions, setCurrentStep } = useQuizStore()
  
  return useMutation<QuizResponse, ApiError, File>({
    mutationFn: api.uploadPdfAndGenerateQuiz,
    onSuccess: (data: QuizResponse) => {
      setQuestions(data.questions)
      setTimeout(() => {
        setCurrentStep('edit')
      }, 1000)
    },
    onError: (error: ApiError) => {
      console.error('PDF upload failed:', error)
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