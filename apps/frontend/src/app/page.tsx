'use client'

import { PdfUpload } from '@/components/pdf-upload'
import { QuestionEditList } from '@/components/question-editor'
import { Quiz } from '@/components/quiz'
import { QuizResults } from '@/components/quiz-results'
import { useQuizStore } from '@/stores/quiz-store'

export default function Home() {
  const { currentStep } = useQuizStore()

  return (
    <div className="container mx-auto">
      {currentStep === 'upload' && <PdfUpload />}
      {currentStep === 'edit' && <QuestionEditList />}
      {currentStep === 'quiz' && <Quiz />}
      {currentStep === 'results' && <QuizResults />}
    </div>
  )
}
