'use client'

import { Check, X, RotateCcw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useQuizStore } from '@/stores/quiz-store'

export function QuizResults() {
  const { questions, answers, getScore, resetQuiz } = useQuizStore()
  const { correct, total, percentage } = getScore()

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return 'Excellent work! 🎉'
    if (percentage >= 80) return 'Great job! 👏'
    if (percentage >= 70) return 'Good effort! 👍'
    if (percentage >= 60) return 'Not bad, but you can do better! 💪'
    return 'Keep studying and try again! 📚'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Quiz Complete!</h1>
        <p className="text-muted-foreground">
          Here are your results and a breakdown of each question
        </p>
      </div>

      {/* Score Summary */}
      <Card className="p-8 text-center">
        <div className="space-y-4">
          <div className={`text-6xl font-bold ${getScoreColor(percentage)}`}>
            {percentage}%
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold">{getScoreMessage(percentage)}</p>
            <p className="text-muted-foreground">
              You got {correct} out of {total} questions correct
            </p>
          </div>
          <Progress value={percentage} className="h-3 max-w-md mx-auto" />
        </div>
      </Card>

      {/* Question Breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Question Breakdown</h2>
        {questions.map((question, index) => {
          const answer = answers.find(a => a.questionId === question.id)
          if (!answer) return null

          return (
            <Card key={question.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg">Question {index + 1}</h3>
                  <div className="flex items-center space-x-2">
                    {answer.isCorrect ? (
                      <div className="flex items-center space-x-1 text-green-600">
                        <Check className="w-5 h-5" />
                        <span className="font-medium">Correct</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-red-600">
                        <X className="w-5 h-5" />
                        <span className="font-medium">Incorrect</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-foreground">{question.question}</p>

                <div className="grid gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Your answer:</p>
                    <p className={`p-2 rounded ${
                      answer.isCorrect 
                        ? 'bg-green-50 text-green-900 border border-green-200' 
                        : 'bg-red-50 text-red-900 border border-red-200'
                    }`}>
                      {answer.userAnswer}
                    </p>
                  </div>

                  {!answer.isCorrect && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Correct answer:</p>
                      <p className="p-2 rounded bg-green-50 text-green-900 border border-green-200">
                        {answer.correctAnswer}
                      </p>
                    </div>
                  )}

                  {answer.explanation && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Explanation:</p>
                      <p className="p-2 rounded bg-blue-50 text-blue-900 border border-blue-200">
                        {answer.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Button onClick={resetQuiz} variant="outline" size="lg">
          <RotateCcw className="w-4 h-4 mr-2" />
          Take Another Quiz
        </Button>
      </div>
    </div>
  )
}