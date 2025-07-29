'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Check, X, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { api } from '@/lib/api'
import { useQuizStore } from '@/stores/quiz-store'

export function Quiz() {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [hasAnswered, setHasAnswered] = useState(false)
  
  const {
    questions,
    currentQuestionIndex,
    showFeedback,
    getCurrentQuestion,
    submitAnswer,
    nextQuestion,
    isQuizComplete,
  } = useQuizStore()

  const currentQuestion = getCurrentQuestion()

  const checkAnswerMutation = useMutation({
    mutationFn: api.checkAnswer,
    onSuccess: (result) => {
      if (currentQuestion) {
        submitAnswer(currentQuestion.id, selectedAnswer, result)
        setHasAnswered(true)
      }
    },
  })

  const handleAnswerSelect = (answer: string) => {
    if (!showFeedback && !checkAnswerMutation.isPending) {
      setSelectedAnswer(answer)
    }
  }

  const handleSubmitAnswer = () => {
    if (currentQuestion && selectedAnswer && !hasAnswered) {
      checkAnswerMutation.mutate({
        question_id: currentQuestion.id,
        user_answer: selectedAnswer,
      })
    }
  }

  const handleNextQuestion = () => {
    nextQuestion()
    setSelectedAnswer('')
    setHasAnswered(false)
    checkAnswerMutation.reset()
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
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-medium text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <span className="text-sm font-medium text-muted-foreground">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="p-8">
        <div className="space-y-6">
          <h1 className="text-xl font-semibold leading-relaxed">
            {currentQuestion.question}
          </h1>

          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => {
              const isSelected = selectedAnswer === option
              const isCorrectOption = showFeedback && option === currentQuestion.answer
              const isWrongSelection = showFeedback && isSelected && !isCorrectOption

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showFeedback || checkAnswerMutation.isPending}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                    isSelected
                      ? showFeedback
                        ? isCorrectOption
                          ? 'border-green-500 bg-green-50 text-green-900'
                          : 'border-red-500 bg-red-50 text-red-900'
                        : 'border-primary bg-primary/5'
                      : showFeedback && isCorrectOption
                      ? 'border-green-500 bg-green-50 text-green-900'
                      : 'border-border hover:border-muted-foreground/50'
                  } ${
                    showFeedback || checkAnswerMutation.isPending
                      ? 'cursor-default'
                      : 'cursor-pointer'
                  }`}
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
                disabled={!selectedAnswer || checkAnswerMutation.isPending}
              >
                {checkAnswerMutation.isPending ? 'Checking...' : 'Submit Answer'}
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