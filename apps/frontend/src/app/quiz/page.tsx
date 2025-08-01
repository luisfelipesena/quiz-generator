'use client'

import { Quiz } from '@/components/features/quiz'
import { useQuizStore } from '@/stores/quiz-store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function QuizPage() {
  const { currentStep, questions, currentQuestionIndex } = useQuizStore()
  const router = useRouter()

  // Redirect if no questions available
  useEffect(() => {
    if (questions.length === 0) {
      router.push('/upload')
      return
    }
    
    // Redirect to specific question URL
    if (currentStep === 'quiz') {
      router.push(`/quiz/${currentQuestionIndex + 1}`)
    }
    
    // Handle results redirect
    if (currentStep === 'results') {
      router.push('/results')
    }
  }, [questions.length, currentStep, currentQuestionIndex, router])

  if (questions.length === 0) {
    return null // Will redirect
  }

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <div className="relative py-8 px-4 sm:px-6 lg:px-8">
        <Quiz />
      </div>
    </div>
  )
}