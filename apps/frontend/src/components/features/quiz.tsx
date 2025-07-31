'use client'

import { useState } from 'react'
import { Check, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQuizAnswer } from '@/hooks/useQuizMutations'
import { useQuizStore } from '@/stores/quiz-store'

export function Quiz() {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [hasAnswered, setHasAnswered] = useState(false)
  
  const {
    currentQuestionIndex,
    showFeedback,
    getCurrentQuestion,
    nextQuestion,
    isQuizComplete,
  } = useQuizStore()

  const currentQuestion = getCurrentQuestion()
  const { checkAnswer, isLoading, reset } = useQuizAnswer()

  const handleAnswerSelect = (answer: string) => {
    if (!showFeedback && !isLoading) {
      setSelectedAnswer(answer)
    }
  }

  const handleSubmitAnswer = async () => {
    if (currentQuestion && selectedAnswer && !hasAnswered) {
      try {
        await checkAnswer(currentQuestion.id, selectedAnswer)
        setHasAnswered(true)
      } catch (error) {
        console.error('Failed to check answer:', error)
      }
    }
  }

  const handleNextQuestion = () => {
    nextQuestion()
    setSelectedAnswer('')
    setHasAnswered(false)
    reset()
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <p>No questions available</p>
      </div>
    )
  }

  const isCorrect = showFeedback && selectedAnswer === currentQuestion.answer

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => useQuizStore.getState().setCurrentStep('edit')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="5" height="5" rx="1" fill="#8B5CF6"/>
            <rect x="9" y="2" width="5" height="5" rx="1" fill="#E5E7EB"/>
            <rect x="2" y="9" width="5" height="5" rx="1" fill="#E5E7EB"/>
            <rect x="9" y="9" width="5" height="5" rx="1" fill="#E5E7EB"/>
          </svg>
          <h1 className="text-xl font-semibold text-gray-900">Mathematics Quiz</h1>
        </div>
        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 2V6M11 2V6M3 8H13M4 4H12C12.5523 4 13 4.44772 13 5V12C13 12.5523 12.5523 13 12 13H4C3.44772 13 3 12.5523 3 12V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Upgrade
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Question {currentQuestionIndex + 1}</p>
            <h2 className="text-xl font-medium text-gray-900">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => {
              const isSelected = selectedAnswer === option
              const isCorrectOption = showFeedback && option === currentQuestion.answer
              const isWrongSelection = showFeedback && isSelected && !isCorrectOption

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showFeedback || isLoading}
                  className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? showFeedback
                        ? isCorrectOption
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-primary bg-primary/5'
                      : showFeedback && isCorrectOption
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  } ${
                    showFeedback || isLoading
                      ? 'cursor-default'
                      : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-base ${
                      isCorrectOption ? 'text-green-700' : 
                      isWrongSelection ? 'text-red-700' : 
                      isSelected ? 'text-primary' : 'text-gray-700'
                    }`}>
                      {option}
                    </span>
                    {showFeedback && (
                      <>
                        {isCorrectOption && <Check className="w-5 h-5 text-green-600" />}
                        {isWrongSelection && <X className="w-5 h-5 text-red-600" />}
                      </>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {showFeedback && (
            <div className={`p-4 rounded-lg text-center ${
              isCorrect ? 'bg-green-50' : 'bg-white'
            }`}>
              {isCorrect ? (
                <div className="space-y-2">
                  <Check className="w-12 h-12 text-green-600 mx-auto" />
                  <p className="text-lg font-medium text-green-700">Correct!</p>
                </div>
              ) : (
                <div className="text-left">
                  <p className="text-sm text-gray-600">
                    The correct answer is: <span className="font-medium text-gray-900">{currentQuestion.answer}</span>
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => useQuizStore.getState().setCurrentStep('edit')}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Previous
            </button>
            {!showFeedback ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer || isLoading}
                className="px-6"
              >
                {isLoading ? 'Checking...' : 'Submit Answer'}
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} className="px-6">
                {isQuizComplete() ? 'View Results' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}