'use client'

import { useState, useEffect } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserNameModal } from '@/components/features/user-name-modal'
import { useQuizStore } from '@/stores/quiz-store'

export function QuizResults() {
  const { questions, answers, getScore, resetQuiz, userName } = useQuizStore()
  const { correct, total } = getScore()
  const [showNameModal, setShowNameModal] = useState(false)

  // Show name modal if user name is not set
  useEffect(() => {
    if (!userName.trim()) {
      setShowNameModal(true)
    }
  }, [userName])

  const handleNameModalSuccess = () => {
    setShowNameModal(false)
  }

  const getFirstName = () => {
    return userName.split(' ')[0] || userName
  }



  return (
    <>
      {/* Name Input Modal with React Hook Form + Zod */}
      <UserNameModal 
        isOpen={showNameModal} 
        onSuccess={handleNameModalSuccess}
      />

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Results Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-gray-900">
              Great Work {getFirstName()}, you did very good on your quiz.
            </h1>
            <div className="text-5xl font-bold text-gray-900 mt-4">
              {correct}/{total}
            </div>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-600">Answered Correctly</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-sm text-gray-600">Missed Answers</span>
              </div>
            </div>
            <div className="relative w-full max-w-md mx-auto h-3 bg-gray-200 rounded-full overflow-hidden mt-4">
              <div
                className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-1000"
                style={{ width: `${(correct / total) * 100}%` }}
              />
              <div
                className="absolute right-0 top-0 h-full bg-red-500 transition-all duration-1000"
                style={{ width: `${((total - correct) / total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Button 
            onClick={resetQuiz} 
            size="lg"
            className="px-8 py-3 text-base font-medium rounded-lg"
          >
            Share results →
          </Button>
        </div>

        {/* Result Summary */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Result Summary</h2>
          <div className="space-y-3">
            {questions.map((question, index) => {
              const answer = answers.find(a => a.questionId === question.id)
              if (!answer) return null

              return (
                <details key={question.id} className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600">Question {index + 1}</span>
                      {answer.isCorrect ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <Check className="w-4 h-4" />
                          <span className="text-sm">Correct Answer</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <X className="w-4 h-4" />
                          <span className="text-sm">Wrong Answer</span>
                        </div>
                      )}
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </summary>
                  <div className="mt-3 px-3 pb-3 space-y-3">
                    <p className="text-sm text-gray-700">{question.question}</p>
                    {!answer.isCorrect && (
                      <p className="text-sm text-gray-600">
                        Correct answer: <span className="font-medium text-gray-900">{answer.correctAnswer}</span>
                      </p>
                    )}
                  </div>
                </details>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}