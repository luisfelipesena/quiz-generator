'use client'

import { useRouter } from 'next/navigation'
import { QuizStep, useQuizStore } from '@/stores/quiz-store'
import { useCallback } from 'react'

export function useQuizNavigation() {
  const router = useRouter()
  const { canNavigateToStep, setError, clearError } = useQuizStore()

  const navigateToStep = useCallback((path: string, requiredStep?: string) => {
    clearError()
    
    if (requiredStep && !canNavigateToStep(requiredStep as QuizStep)) {
      setError(`Cannot navigate to ${requiredStep}: missing required data`)
      router.push('/upload')
      return false
    }
    
    router.push(path)
    return true
  }, [router, canNavigateToStep, setError, clearError])

  const navigateToUpload = useCallback(() => navigateToStep('/upload'), [navigateToStep])
  const navigateToReview = useCallback(() => navigateToStep('/review', 'edit'), [navigateToStep])
  const navigateToQuiz = useCallback((questionIndex = 1) => navigateToStep(`/quiz/${questionIndex}`, 'quiz'), [navigateToStep])
  const navigateToResults = useCallback(() => navigateToStep('/results', 'results'), [navigateToStep])

  return {
    navigateToUpload,
    navigateToReview,
    navigateToQuiz,
    navigateToResults,
    navigateToStep,
  }
}