'use client'

import { PdfUpload } from '@/components/features/pdf-upload'
import { LoadingTransition } from '@/components/features/loading-transition'
import { useQuizStore } from '@/stores/quiz-store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function UploadPage() {
  const { currentStep, questions } = useQuizStore()
  const router = useRouter()

  // Handle automatic transitions for loading states only if we have questions
  useEffect(() => {
    if (currentStep === 'edit' && questions.length > 0) {
      router.push('/review')
    }
  }, [currentStep, questions.length, router])

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <div className="relative flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
        {currentStep === 'upload' && (
          <div className="w-full">
            <PdfUpload />
          </div>
        )}
        
        {currentStep === 'generating' && (
          <div className="w-full">
            <LoadingTransition 
              title="Generating Quiz Questions"
              subtitle="Reading your materials..."
              showNextButton={false}
              nextStep="edit"
            />
          </div>
        )}
      </div>
    </div>
  )
}