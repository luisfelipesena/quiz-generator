'use client'

import { useState } from 'react'
import { Edit3, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { type QuestionAnswer, type QuestionUpdateRequest } from '@/lib/api'
import { useQuizStore } from '@/stores/quiz-store'
import { UnstuckIcon, BackArrowIcon } from '@/components/icons'

interface QuestionEditorProps {
  question: QuestionAnswer
  index: number
}

export function QuestionEditor({ question, index }: QuestionEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedQuestion, setEditedQuestion] = useState(question)
  const { updateQuestion } = useQuizStore()

  const handleSave = () => {
    const questionUpdate: QuestionUpdateRequest = {
      id: editedQuestion.id,
      question: editedQuestion.question,
      answer: editedQuestion.answer,
      options: editedQuestion.options,
    }
    updateQuestion(question.id, questionUpdate)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedQuestion(question)
    setIsEditing(false)
  }

  const updateOption = (optionIndex: number, value: string) => {
    const newOptions = [...(editedQuestion.options || [])]
    newOptions[optionIndex] = value
    setEditedQuestion({
      ...editedQuestion,
      options: newOptions,
    })
  }

  const isCorrectAnswer = (option: string) => option === editedQuestion.answer

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="space-y-4">

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900">Question {index + 1}</h3>
            {isEditing ? (
              <Textarea
                value={editedQuestion.question}
                onChange={(e) =>
                  setEditedQuestion({
                    ...editedQuestion,
                    question: e.target.value,
                  })
                }
                className="mt-2 w-full resize-none border-gray-300 rounded-lg"
                rows={2}
              />
            ) : (
              <p className="mt-2 text-base text-gray-700">{question.question}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-600">Multichoice Answers</h4>
          {editedQuestion.options && editedQuestion.options.length > 0 && (
            <div className="space-y-2">
              {editedQuestion.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 min-w-[60px]">
                    Option {optionIndex + 1}:
                  </span>
                  {isEditing ? (
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(optionIndex, e.target.value)}
                        className="flex-1 h-10 border-gray-300 rounded-lg"
                      />
                      {isCorrectAnswer(option) && (
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center gap-2">
                      <div className={`flex-1 h-10 px-3 flex items-center rounded-lg border ${isCorrectAnswer(option) ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
                        <span className={`text-sm ${isCorrectAnswer(option) ? 'text-green-700 font-medium' : 'text-gray-700'}`}>
                          {option}
                        </span>
                      </div>
                      {isCorrectAnswer(option) && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Check className="w-5 h-5" />
                          <span className="text-xs font-medium">Correct Answer</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {isEditing && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Label className="text-sm font-medium text-gray-600">Correct Answer</Label>
              <Input
                value={editedQuestion.answer}
                onChange={(e) =>
                  setEditedQuestion({
                    ...editedQuestion,
                    answer: e.target.value,
                  })
                }
                className="mt-1 border-gray-300 rounded-lg"
                placeholder="Enter the correct answer"
              />
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        ) : (
          <div className="flex justify-end pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export function QuestionEditList() {
  const { questions, setCurrentStep } = useQuizStore()

  const handleStartQuiz = () => {
    // Show preparing screen first
    setCurrentStep('preparing')
    // Then transition to quiz after a short delay
    setTimeout(() => {
      setCurrentStep('quiz')
    }, 2000)
  }

  const handleBack = () => {
    setCurrentStep('upload')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <BackArrowIcon width={20} height={20} />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <UnstuckIcon 
            width={24} 
            height={24} 
            className="text-primary" 
          />
          <h1 className="text-2xl font-semibold text-gray-900">
            Review & Edit Questions
          </h1>
        </div>
      </div>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {questions.map((question, index) => (
          <QuestionEditor key={question.id} question={question} index={index} />
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Button 
          onClick={handleStartQuiz} 
          size="lg" 
          className="px-8 py-3 text-base font-medium rounded-lg"
        >
          Start Quiz
        </Button>
      </div>
    </div>
  )
}