'use client'

import { PdfUpload } from '@/components/features/pdf-upload'
import { LoadingTransition } from '@/components/features/loading-transition'
import { QuestionEditList } from '@/components/features/question-editor'
import { Quiz } from '@/components/features/quiz'
import { QuizResults } from '@/components/features/quiz-results'
import { useQuizStore } from '@/stores/quiz-store'

export default function Home() {
  const { currentStep } = useQuizStore()

  return (
    <div className="w-full">
      <div className="relative min-h-[80vh] flex items-center justify-center">
        {/* Step transitions with animation */}
        <div className={`transition-all duration-500 ease-in-out w-full ${
          currentStep === 'upload' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-100%] absolute inset-0 pointer-events-none'
        }`}>
          <PdfUpload />
        </div>
        
        <div className={`transition-all duration-500 ease-in-out w-full ${
          currentStep === 'generating' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-100%] absolute inset-0 pointer-events-none'
        }`}>
          <LoadingTransition 
            title="Generating Quiz Questions"
            subtitle="Reading your materials..."
            showNextButton={false}
            nextStep="edit"
            nextLabel="Continue"
          />
        </div>
        
        <div className={`transition-all duration-500 ease-in-out w-full ${
          currentStep === 'edit' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-100%] absolute inset-0 pointer-events-none flex items-center justify-center'
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
            nextLabel="Start Quiz"
          />
        </div>
        
        <div className={`transition-all duration-500 ease-in-out w-full ${
          currentStep === 'quiz' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-100%] absolute inset-0 pointer-events-none flex items-center justify-center'
        }`}>
          <Quiz />
        </div>
        
        <div className={`transition-all duration-500 ease-in-out w-full ${
          currentStep === 'results' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-100%] absolute inset-0 pointer-events-none flex items-center justify-center'
        }`}>
          <QuizResults />
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
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
