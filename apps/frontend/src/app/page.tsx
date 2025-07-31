'use client'

import { PdfUpload } from '@/components/features/pdf-upload'
import { LoadingTransition } from '@/components/features/loading-transition'
import { QuestionEditList } from '@/components/features/question-editor'
import { Quiz } from '@/components/features/quiz'
import { QuizResults } from '@/components/features/quiz-results'
import { useQuizStore } from '@/stores/quiz-store'
import { Button } from '@/components/ui/button'
import { useSyncQuizState } from '@/hooks/useSyncQuizState'

export default function Home() {
  const { currentStep, questions, setCurrentStep } = useQuizStore()
  useSyncQuizState()

  const hasExistingQuiz = questions.length > 0

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <div className="relative min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8">
        {/* Step transitions with animation */}
        <div className={`transition-all duration-500 ease-in-out w-full ${
          currentStep === 'upload' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-100%] absolute inset-0 pointer-events-none'
        }`}>
          <PdfUpload />

          {hasExistingQuiz && currentStep === 'upload' && (
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">You have an existing quiz.</p>
              <Button onClick={() => setCurrentStep('edit')} size="lg">
                Continue Quiz
              </Button>
            </div>
          )}
        </div>
        
        <div className={`transition-all duration-500 ease-in-out w-full ${
          currentStep === 'generating' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-100%] absolute inset-0 pointer-events-none'
        }`}>
          <LoadingTransition 
            title="Generating Quiz Questions"
            subtitle="Reading your materials..."
            showNextButton={false}
            nextStep="edit"
          />
        </div>
        
        <div className={`transition-all duration-500 ease-in-out w-full ${
          currentStep === 'edit' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-100%] absolute inset-0 pointer-events-none'
        }`}>
          <QuestionEditList />
        </div>
        
        <div className={`transition-all duration-500 ease-in-out w-full ${
          currentStep === 'preparing' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-100%] absolute inset-0 pointer-events-none'
        }`}>
          <LoadingTransition 
            title="Preparing Quiz for Practice"
            subtitle="Preparing the quiz so you can now practice..."
            showNextButton={false}
            nextStep="quiz"
          />
        </div>
        
        <div className={`transition-all duration-500 ease-in-out w-full ${
          currentStep === 'quiz' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-100%] absolute inset-0 pointer-events-none'
        }`}>
          <Quiz />
        </div>
        
        <div className={`transition-all duration-500 ease-in-out w-full ${
          currentStep === 'results' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-100%] absolute inset-0 pointer-events-none'
        }`}>
          <QuizResults />
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-card/80 backdrop-blur-sm border rounded-full px-4 py-2 shadow-lg">
          <div className="flex space-x-2">
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              ['upload', 'generating'].includes(currentStep) ? 'bg-primary' : 'bg-muted'
            }`} />
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              ['edit', 'preparing'].includes(currentStep) ? 'bg-primary' : 'bg-muted'
            }`} />
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentStep === 'quiz' ? 'bg-primary' : 'bg-muted'
            }`} />
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentStep === 'results' ? 'bg-primary' : 'bg-muted'
            }`} />
          </div>
        </div>
      </div>
    </div>
  )
}
