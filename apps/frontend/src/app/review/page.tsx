'use client'

import { QuestionEditList } from '@/components/features/question-editor'
import { LoadingTransition } from '@/components/features/loading-transition'
import { useQuizStore } from '@/stores/quiz-store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ReviewPage() {
  const { currentStep, questions } = useQuizStore()
  const router = useRouter()

  // Redirect if no questions available
  useEffect(() => {
    if (questions.length === 0 && currentStep !== 'generating') {
      router.push('/upload')
    }
  }, [questions.length, currentStep, router])

  // Handle automatic transitions for loading states
  useEffect(() => {
    if (currentStep === 'quiz') {
      router.push('/quiz/1')
    }
  }, [currentStep, router])

  if (questions.length === 0 && currentStep !== 'generating') {
    return null // Will redirect
  }

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <div className="relative py-8 px-4 sm:px-6 lg:px-8">
        {currentStep === 'edit' && (
          <div className="w-full">
            <QuestionEditList />
          </div>
        )}
        
        {currentStep === 'preparing' && (
          <div className="flex items-center justify-center py-16">
            <div className="w-full">
              <LoadingTransition 
                title="Preparing Quiz for Practice"
                subtitle="Preparing the quiz so you can now practice..."
                showNextButton={false}
                nextStep="quiz"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}