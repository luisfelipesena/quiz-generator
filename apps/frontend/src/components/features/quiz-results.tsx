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
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-in fade-in zoom-in duration-1000">
          🎉 Quiz Complete! 🎉
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Here are your results and a breakdown of each question
        </p>
      </div>

      {/* Score Summary */}
      <Card className="p-8 text-center transition-all duration-500 hover:shadow-xl animate-in fade-in zoom-in duration-700" style={{ animationDelay: '200ms' }}>
        <div className="space-y-6">
          <div className={`text-8xl font-bold transition-all duration-1000 animate-in zoom-in ${getScoreColor(percentage)}`} style={{ animationDelay: '400ms' }}>
            {percentage}%
          </div>
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-700" style={{ animationDelay: '600ms' }}>
            <p className="text-2xl font-semibold">{getScoreMessage(percentage)}</p>
            <p className="text-lg text-muted-foreground">
              You got <span className="font-bold text-primary">{correct}</span> out of <span className="font-bold">{total}</span> questions correct
            </p>
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700" style={{ animationDelay: '800ms' }}>
            <Progress value={percentage} className="h-4 max-w-md mx-auto" />
          </div>
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
      <div className="flex justify-center space-x-4 animate-in fade-in slide-in-from-bottom-2 duration-700" style={{ animationDelay: '1000ms' }}>
        <Button 
          onClick={resetQuiz} 
          variant="outline" 
          size="lg"
          className="px-8 py-4 text-lg relative overflow-hidden group transition-all duration-300 hover:scale-105"
        >
          <RotateCcw className="w-5 h-5 mr-2 transition-transform group-hover:rotate-180 duration-300" />
          <span className="relative z-10">Take Another Quiz</span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </Button>
      </div>
    </div>
  )
}