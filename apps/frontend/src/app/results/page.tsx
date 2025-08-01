'use client'

import { QuizResults } from '@/components/features/quiz-results'
import { useQuizStore } from '@/stores/quiz-store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ResultsPage() {
  const { questions, answers } = useQuizStore()
  const router = useRouter()

  // Redirect if no quiz data available
  useEffect(() => {
    if (questions.length === 0 || answers.length === 0) {
      router.push('/upload')
      return
    }
  }, [questions.length, answers.length, router])

  if (questions.length === 0 || answers.length === 0) {
    return null // Will redirect
  }

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <div className="relative py-8 px-4 sm:px-6 lg:px-8">
        <QuizResults />
      </div>
    </div>
  )
}