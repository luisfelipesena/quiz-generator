'use client'

import { useState } from 'react'
import { Edit3, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { type QuestionAnswer, type QuestionUpdateRequest } from '@/lib/api'
import { useQuizStore } from '@/stores/quiz-store'
import { useSessionId } from '@/hooks/useSessionId'
import { UnstuckIcon, BackArrowIcon } from '@/components/icons'
import { useRouter } from 'next/navigation'

interface QuestionEditorProps {
  question: QuestionAnswer
  index: number
}

export function QuestionEditor({ question, index }: QuestionEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedQuestion, setEditedQuestion] = useState(question)
  const { updateQuestion } = useQuizStore()
  const sessionId = useSessionId()

  const handleSave = () => {
    const questionUpdate: QuestionUpdateRequest = {
      id: editedQuestion.id,
      question: editedQuestion.question,
      answer: editedQuestion.answer,
      options: editedQuestion.options,
    }
    updateQuestion(question.id, questionUpdate, sessionId)
    setIsEditing(false)
    toast.success('Question updated successfully!')
  }

  const handleCancel = () => {
    setEditedQuestion(question)
    setIsEditing(false)
  }

  const updateOption = (optionIndex: number, value: string) => {
    const newOptions = [...(editedQuestion.options || [])]
    const oldValue = newOptions[optionIndex]
    newOptions[optionIndex] = value
    
    // If this option was the correct answer, update the answer field too
    const updatedState = {
      ...editedQuestion,
      options: newOptions,
    }
    
    if (editedQuestion.answer === oldValue) {
      updatedState.answer = value
    }
    
    setEditedQuestion(updatedState)
  }

  const isCorrectAnswer = (option: string) => option === editedQuestion.answer

  const setCorrectAnswer = (answer: string) => {
    setEditedQuestion({
      ...editedQuestion,
      answer,
    })
  }

  const handleAnswerChange = (newAnswer: string) => {
    // If the new answer matches one of the options, use it directly
    if (editedQuestion.options?.includes(newAnswer)) {
      setCorrectAnswer(newAnswer)
    } else {
      // If it doesn't match any option, still update it (backend will handle validation)
      setCorrectAnswer(newAnswer)
    }
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
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
                <div key={optionIndex} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <span className="text-sm text-gray-500 min-w-[60px]">
                    Option {optionIndex + 1}:
                  </span>
                  {isEditing ? (
                    <div className="w-full flex-1 flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(optionIndex, e.target.value)}
                        className={`flex-1 h-10 rounded-lg ${isCorrectAnswer(option) ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
                      />
                      <button
                        type="button"
                        onClick={() => setCorrectAnswer(option)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                          isCorrectAnswer(option) 
                            ? 'text-green-600 bg-green-100' 
                            : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        {isCorrectAnswer(option) ? 'Correct' : 'Set as correct'}
                      </button>
                    </div>
                  ) : (
                    <div className="w-full flex-1 flex items-center gap-2">
                      <div className={`w-full flex-1 h-10 px-3 flex items-center rounded-lg border ${isCorrectAnswer(option) ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
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
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="mt-1 border-gray-300 rounded-lg"
                placeholder="Enter the correct answer"
              />
              {editedQuestion.options && !editedQuestion.options.includes(editedQuestion.answer) && (
                <p className="text-xs text-amber-600 mt-1">
                  ⚠️ This answer doesn't match any of the options above. The first option will be updated automatically when saved.
                </p>
              )}
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
  const router = useRouter()

  const handleStartQuiz = () => {
    // Show preparing screen first
    setCurrentStep('preparing')
    // Then navigate to quiz after a short delay
    setTimeout(() => {
      router.push('/quiz/1')
    }, 2000)
  }

  const handleBack = () => {
    useQuizStore.getState().setCurrentStep('upload')
    router.push('/upload')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <BackArrowIcon width={20} height={20} />
            <span className="text-sm font-medium">Back</span>
          </button>

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
      </div>

      <div className="space-y-4 pb-20">
        {questions.map((question, index) => (
          <QuestionEditor key={question.id} question={question} index={index} />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center p-4 bg-white border-t border-gray-200 shadow-lg z-50">
        <Button 
          onClick={handleStartQuiz} 
          size="lg" 
          className="px-8 py-3 text-base font-medium rounded-lg w-full max-w-xs"
        >
          Start Quiz
        </Button>
      </div>
    </div>
  )
}