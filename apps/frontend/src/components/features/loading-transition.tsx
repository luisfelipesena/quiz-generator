'use client'

import { TransitionIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { useQuizStore, type QuizStep } from '@/stores/quiz-store'

interface LoadingTransitionProps {
  title: string
  subtitle: string
  showNextButton?: boolean
  nextStep?: QuizStep
  nextLabel?: string
}

export function LoadingTransition({ title, subtitle, showNextButton = false, nextStep, nextLabel = "Next" }: LoadingTransitionProps) {
  const { setCurrentStep } = useQuizStore()

  const handleNext = () => {
    if (nextStep) {
      setCurrentStep(nextStep)
    }
  }
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-8">
        {/* Animated transition icon */}
        <div className="flex justify-center">
          <TransitionIcon 
            width={200} 
            height={90} 
            className="text-primary" 
          />
        </div>
        
        {/* Loading content */}
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">
            {title}
          </h1>
          <p className="text-base text-muted-foreground">
            {subtitle}
          </p>
        </div>
        
        {/* Progress dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Next button (optional) */}
        {showNextButton && (
          <div className="flex justify-center pt-4">
            <Button onClick={handleNext} size="lg" className="px-8">
              {nextLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}