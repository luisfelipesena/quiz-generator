'use client'

import { Check, X } from 'lucide-react'
import { SuccessIcon } from '@/components/icons'

interface QuestionCardProps {
  questionNumber: number
  question: string
  options: string[]
  selectedAnswer?: string
  correctAnswer?: string
  showFeedback?: boolean
  disabled?: boolean
  onAnswerSelect?: (answer: string) => void
  mode?: 'quiz' | 'review' | 'edit'
  isCorrect?: boolean
}

export function QuestionCard({
  questionNumber,
  question,
  options,
  selectedAnswer,
  correctAnswer,
  showFeedback = false,
  disabled = false,
  onAnswerSelect,
  mode = 'quiz',
  isCorrect
}: QuestionCardProps) {
  const handleAnswerSelect = (answer: string) => {
    if (!disabled && onAnswerSelect) {
      onAnswerSelect(answer)
    }
  }

  const getOptionClassName = (option: string) => {
    const isSelected = selectedAnswer === option
    const isCorrectOption = showFeedback && option === correctAnswer
    const isWrongSelection = showFeedback && isSelected && !isCorrectOption

    if (mode === 'review') {
      if (option === correctAnswer) {
        return 'border-green-500 bg-green-50'
      }
      if (isSelected && !isCorrectOption) {
        return 'border-red-500 bg-red-50'
      }
      return 'border-gray-200 bg-gray-50'
    }

    if (isSelected) {
      if (showFeedback) {
        return isCorrectOption ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
      }
      return 'border-primary bg-primary/10'
    }

    if (showFeedback && isCorrectOption) {
      return 'border-green-500 bg-green-50'
    }

    return 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
  }

  const getCircleClassName = (option: string) => {
    const isSelected = selectedAnswer === option
    const isCorrectOption = showFeedback && option === correctAnswer
    const isWrongSelection = showFeedback && isSelected && !isCorrectOption

    if (mode === 'review') {
      if (option === correctAnswer) {
        return 'border-green-500 bg-green-500'
      }
      if (isSelected && !isCorrectOption) {
        return 'border-red-500 bg-red-500'
      }
      return 'border-gray-300'
    }

    if (isSelected) {
      if (showFeedback) {
        return isCorrectOption ? 'border-green-500 bg-green-500' : 'border-red-500 bg-red-500'
      }
      return 'border-primary bg-primary'
    }

    if (showFeedback && isCorrectOption) {
      return 'border-green-500 bg-green-500'
    }

    return 'border-gray-300'
  }

  const getTextClassName = (option: string) => {
    const isSelected = selectedAnswer === option
    const isCorrectOption = showFeedback && option === correctAnswer
    const isWrongSelection = showFeedback && isSelected && !isCorrectOption

    if (mode === 'review') {
      if (option === correctAnswer) {
        return 'text-green-700'
      }
      if (isSelected && !isCorrectOption) {
        return 'text-red-700'
      }
      return 'text-gray-700'
    }

    if (isCorrectOption) {
      return 'text-green-700'
    }
    if (isWrongSelection) {
      return 'text-red-700'
    }
    if (isSelected) {
      return 'text-primary'
    }
    return 'text-foreground'
  }

  const renderIcon = (option: string) => {
    const isSelected = selectedAnswer === option
    const isCorrectOption = showFeedback && option === correctAnswer
    const isWrongSelection = showFeedback && isSelected && !isCorrectOption

    if (mode === 'review') {
      if (option === correctAnswer) {
        return <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
      }
      if (isSelected && !isCorrectOption) {
        return <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
      }
      return null
    }

    if (isSelected || (showFeedback && isCorrectOption)) {
      if (showFeedback) {
        if (isCorrectOption) {
          return <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
        } else if (isWrongSelection) {
          return <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
        }
      } else {
        return <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
      }
    }
    return null
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-8">
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Question {questionNumber}</p>
          <h2 className="text-lg sm:text-xl font-medium text-gray-900 leading-tight">
            {question}
          </h2>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option
            const isCorrectOption = showFeedback && option === correctAnswer

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={disabled}
                className={`w-full p-3 sm:p-5 text-left rounded-xl border-2 transition-all duration-200 ${getOptionClassName(option)} ${
                  disabled ? 'cursor-default' : 'cursor-pointer hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${getCircleClassName(option)}`}>
                    {renderIcon(option)}
                  </div>
                  <span className={`text-sm sm:text-base font-medium leading-relaxed ${getTextClassName(option)}`}>
                    {option}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {showFeedback && isCorrect && (
          <div className="bg-green-50 text-center p-4 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <SuccessIcon className="w-6 h-6 text-green-600" />
              <p className="text-lg font-medium text-green-700">Correct!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}