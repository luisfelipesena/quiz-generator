'use client'

import { Quiz } from '@/components/features/quiz'
import { useQuizStore } from '@/stores/quiz-store'
import { useRouter, useParams } from 'next/navigation'
import { useEffect } from 'react'

export default function QuestionPage() {
  const { questions, currentQuestionIndex, setCurrentQuestionIndex, currentStep } = useQuizStore()
  const router = useRouter()
  const params = useParams()

  const questionId = parseInt(params.questionId as string)

  useEffect(() => {
    // Redirect if no questions available
    if (questions.length === 0) {
      router.push('/upload')
      return
    }

    // Validate question ID and set current question index
    if (questionId && questionId >= 1 && questionId <= questions.length) {
      const questionIndex = questionId - 1
      if (currentQuestionIndex !== questionIndex) {
        setCurrentQuestionIndex(questionIndex)
      }
    } else {
      // Invalid question ID, redirect to first question
      router.push('/quiz/1')
      return
    }

    // Handle results redirect
    if (currentStep === 'results') {
      router.push('/results')
    }
  }, [questions.length, questionId, currentQuestionIndex, currentStep, router, setCurrentQuestionIndex])

  if (questions.length === 0) {
    return null // Will redirect
  }

  if (!questionId || questionId < 1 || questionId > questions.length) {
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