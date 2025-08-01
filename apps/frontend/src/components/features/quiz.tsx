'use client'

import { useState, useEffect } from 'react'
import { Check, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQuizAnswer } from '@/hooks/useQuizMutations'
import { useStreamingFeedback } from '@/hooks/useStreamingFeedback'
import { useQuizStore } from '@/stores/quiz-store'
import { BackArrowIcon, SuccessIcon } from '@/components/icons'
import { PdfIcon } from '@/components/icons/pdf-icon'
import { useRouter } from 'next/navigation'

export function Quiz() {
  const [hasAnswered, setHasAnswered] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const {
    currentQuestionIndex,
    showFeedback,
    getCurrentQuestion,
    nextQuestion,
    isQuizComplete,
    quizTitle,
    questions,
    setUserAnswer,
    getUserAnswer,
  } = useQuizStore()
  
  const router = useRouter()

  const currentQuestion = getCurrentQuestion()
  const { checkAnswer, isLoading, reset } = useQuizAnswer()
  const { feedback: streamingFeedback, isStreaming, startStreaming, reset: resetStreaming } = useStreamingFeedback()
  
  // Get selected answer from store or state
  const selectedAnswer = currentQuestion ? getUserAnswer(currentQuestion.id) || '' : ''

  const handleAnswerSelect = (answer: string) => {
    if (!showFeedback && !isLoading && currentQuestion) {
      setUserAnswer(currentQuestion.id, answer)
    }
  }

  const handleSubmitAnswer = async () => {
    if (currentQuestion && selectedAnswer && !hasAnswered) {
      try {
        // First check the answer normally to show immediate feedback
        await checkAnswer(currentQuestion.id, selectedAnswer)
        setHasAnswered(true)
        
        // If answer is incorrect, start streaming feedback
        const isCorrect = selectedAnswer === currentQuestion.answer
        if (!isCorrect) {
          startStreaming({
            questionId: currentQuestion.id,
            userAnswer: selectedAnswer,
            questions: questions,
          })
        }
      } catch (error) {
        console.error('Failed to check answer:', error)
      }
    }
  }

  const handleNextQuestion = () => {
    nextQuestion()
    setHasAnswered(false)
    resetStreaming()
    reset()
    
    // Navigate to next question or results
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex >= questions.length) {
      router.push('/results')
    } else {
      router.push(`/quiz/${nextIndex + 1}`)
    }
  }

  if (!isClient) {
    // Render nothing on the server to avoid hydration mismatch
    return null
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-4 pt-16">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-medium text-yellow-800 mb-2">No Questions Available</h2>
          <p className="text-yellow-700 mb-4">
            It looks like there are no questions to display. Please go back and generate some questions first.
          </p>
          <Button 
            onClick={() => useQuizStore.getState().setCurrentStep('upload')}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            Start Over
          </Button>
        </div>
      </div>
    )
  }

  const isCorrect = showFeedback && selectedAnswer === currentQuestion.answer

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-sm z-10 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              useQuizStore.getState().setCurrentStep('edit')
              router.push('/review')
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <BackArrowIcon width={20} height={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
              <PdfIcon width={16} height={16} className="text-white" />
            </div>
            <h1 className="text-xl font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">{quizTitle}</h1>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-8 max-h-[calc(100vh-12rem)] overflow-y-auto">
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Question {currentQuestionIndex + 1}</p>
            <h2 className="text-lg sm:text-xl font-medium text-gray-900 leading-tight">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {currentQuestion.options?.map((option, index) => {
              const isSelected = selectedAnswer === option
              const isCorrectOption = showFeedback && option === currentQuestion.answer
              const isWrongSelection = showFeedback && isSelected && !isCorrectOption

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showFeedback || isLoading}
                  className={`w-full p-3 sm:p-5 text-left rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? showFeedback
                        ? isCorrectOption
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-primary bg-primary/10'
                      : showFeedback && isCorrectOption
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                  } ${
                    showFeedback || isLoading
                      ? 'cursor-default'
                      : 'cursor-pointer hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isSelected
                        ? showFeedback
                          ? isCorrectOption
                            ? 'border-green-500 bg-green-500'
                            : 'border-red-500 bg-red-500'
                          : 'border-primary bg-primary'
                        : showFeedback && isCorrectOption
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {(isSelected || (showFeedback && isCorrectOption)) && (
                        showFeedback ? (
                          isCorrectOption ? (
                            <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                          ) : isWrongSelection ? (
                            <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                          ) : null
                        ) : (
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
                        )
                      )}
                    </div>
                    <span className={`text-sm sm:text-base font-medium leading-relaxed ${
                      isCorrectOption ? 'text-green-700' : 
                      isWrongSelection ? 'text-red-700' : 
                      isSelected ? 'text-primary' : 'text-foreground'
                    }`}>
                      {option}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {showFeedback && (
            <div className={`p-4 rounded-lg ${
              isCorrect ? 'bg-green-50 text-center' : 'bg-white border border-gray-200'
            }`}>
              {isCorrect ? (
                <div className="space-y-2">
                  <SuccessIcon className="w-12 h-12 text-green-600 mx-auto" />
                  <p className="text-lg font-medium text-green-700">Correct!</p>
                </div>
              ) : (
                <div className="text-left space-y-3">
                  {streamingFeedback ? (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-blue-900 mb-2">
                            💡 AI Tutor Feedback
                          </p>
                          <div className="bg-white/60 rounded-md p-3 border border-blue-100">
                            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                              {streamingFeedback}
                              {isStreaming && (
                                <span className="inline-block w-0.5 h-4 bg-blue-600 ml-0.5 animate-pulse"></span>
                              )}
                            </p>
                          </div>
                          {!isStreaming && streamingFeedback && (
                            <p className="text-xs text-blue-600 mt-2 italic">
                              ✨ Generated by AI to help you learn better
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-800">
                        The correct answer is: <span className="font-medium">{currentQuestion.answer}</span>
                      </p>
                      {isStreaming && (
                        <p className="text-xs text-red-600 mt-1 flex items-center">
                          Getting personalized feedback...
                          <span className="inline-block w-2 h-2 bg-red-600 rounded-full ml-2 animate-pulse"></span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-2 gap-3">
            <button
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  router.push(`/quiz/${currentQuestionIndex}`)
                } else {
                  useQuizStore.getState().setCurrentStep('edit')
                  router.push('/review')
                }
              }}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
            >
              ← Previous
            </button>
            {!showFeedback ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer || isLoading}
                className="px-4 sm:px-6 text-sm sm:text-base"
              >
                {isLoading ? 'Checking...' : 'Submit Answer'}
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} className="px-4 sm:px-6 text-sm sm:text-base">
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