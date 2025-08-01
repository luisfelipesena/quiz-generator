'use client'

import { Button } from '@/components/ui/button'
import { UnstuckIcon } from '@/components/icons'
import { useRouter } from 'next/navigation'
import { useQuizStore } from '@/stores/quiz-store'

export function Landing() {
  const router = useRouter()
  const { questions, resetQuiz } = useQuizStore()
  
  const hasExistingQuiz = questions.length > 0

  const handleStartNew = () => {
    resetQuiz()
    router.push('/upload')
  }

  const handleContinueExisting = () => {
    router.push('/review')
  }

  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      <div className="space-y-6">
        <div className="flex justify-center">
          <UnstuckIcon width={80} height={80} className="text-primary" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Unstuck Quiz Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            Transform your PDF documents into interactive quizzes powered by AI. 
            Perfect for studying, training, and knowledge assessment.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {hasExistingQuiz ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-medium">
                You have an existing quiz ready to continue.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handleContinueExisting}
                size="lg" 
                className="px-8 py-3 text-base font-medium"
              >
                Continue Existing Quiz
              </Button>
              <Button 
                onClick={handleStartNew}
                variant="outline"
                size="lg" 
                className="px-8 py-3 text-base font-medium"
              >
                Start New Quiz
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            onClick={handleStartNew}
            size="lg" 
            className="px-8 py-3 text-base font-medium"
          >
            Get Started
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 text-left">
        <div className="space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📄</span>
          </div>
          <h3 className="font-semibold text-gray-900">Upload PDF</h3>
          <p className="text-sm text-gray-600">
            Upload your study materials, documents, or training content.
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="font-semibold text-gray-900">AI Generation</h3>
          <p className="text-sm text-gray-600">
            Our AI analyzes your content and generates relevant quiz questions.
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="font-semibold text-gray-900">Take Quiz</h3>
          <p className="text-sm text-gray-600">
            Review, edit questions, and take your personalized quiz.
          </p>
        </div>
      </div>
    </div>
  )
}