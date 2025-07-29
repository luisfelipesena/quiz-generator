'use client'

import { useState } from 'react'
import { Check, X, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useQuizAnswer } from '@/hooks/useQuizMutations'
import { useQuizStore } from '@/stores/quiz-store'

export function Quiz() {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [hasAnswered, setHasAnswered] = useState(false)
  
  const {
    questions,
    currentQuestionIndex,
    showFeedback,
    getCurrentQuestion,
    nextQuestion,
    isQuizComplete,
  } = useQuizStore()

  const currentQuestion = getCurrentQuestion()
  const { checkAnswer, isLoading, error, reset } = useQuizAnswer()

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

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const isCorrect = showFeedback && selectedAnswer === currentQuestion.answer

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2 p-4 bg-card/50 backdrop-blur-sm rounded-lg border">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Quiz Time!
            </h1>
            <h2 className="text-sm font-medium text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      <Card className="p-8 transition-all duration-300 hover:shadow-lg">
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500">
            {currentQuestion.question}
          </h1>

          <div className="space-y-4">
            {currentQuestion.options?.map((option, index) => {
              const isSelected = selectedAnswer === option
              const isCorrectOption = showFeedback && option === currentQuestion.answer
              const isWrongSelection = showFeedback && isSelected && !isCorrectOption

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showFeedback || isLoading}
                  className={`w-full p-5 text-left rounded-lg border-2 transition-all duration-300 transform hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-2 ${
                    isSelected
                      ? showFeedback
                        ? isCorrectOption
                          ? 'border-green-500 bg-green-50 text-green-900 shadow-green-100 shadow-lg'
                          : 'border-red-500 bg-red-50 text-red-900 shadow-red-100 shadow-lg'
                        : 'border-primary bg-primary/5 shadow-primary/20 shadow-lg'
                      : showFeedback && isCorrectOption
                      ? 'border-green-500 bg-green-50 text-green-900 shadow-green-100 shadow-lg'
                      : 'border-border hover:border-muted-foreground/50 hover:bg-accent/50'
                  } ${
                    showFeedback || isLoading
                      ? 'cursor-default'
                      : 'cursor-pointer'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-muted-foreground min-w-[20px]">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span>{option}</span>
                    </div>
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
            <div className={`p-4 rounded-lg ${
              isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start space-x-2">
                {isCorrect ? (
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <X className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <div>
                  <p className={`font-medium ${
                    isCorrect ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </p>
                  {!isCorrect && (
                    <p className="text-sm text-red-800 mt-1">
                      The correct answer is: <strong>{currentQuestion.answer}</strong>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <div />
            {!showFeedback ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer || isLoading}
              >
                {isLoading ? 'Checking...' : 'Submit Answer'}
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                {isQuizComplete() ? 'View Results' : 'Next Question'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}