'use client'

import { useState } from 'react'
import { Edit3, Save, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { type QuestionAnswer, type QuestionUpdateRequest } from '@/lib/api'
import { useQuizStore } from '@/stores/quiz-store'

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

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">Question {index + 1}</h3>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {isEditing ? (
          <>
            <div>
              <Label htmlFor={`question-${question.id}`}>Question</Label>
              <Textarea
                id={`question-${question.id}`}
                value={editedQuestion.question}
                onChange={(e) =>
                  setEditedQuestion({
                    ...editedQuestion,
                    question: e.target.value,
                  })
                }
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor={`answer-${question.id}`}>Correct Answer</Label>
              <Input
                id={`answer-${question.id}`}
                value={editedQuestion.answer}
                onChange={(e) =>
                  setEditedQuestion({
                    ...editedQuestion,
                    answer: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>

            {editedQuestion.options && editedQuestion.options.length > 0 && (
              <div>
                <Label>Answer Options</Label>
                <div className="space-y-2 mt-2">
                  {editedQuestion.options.map((option, optionIndex) => (
                    <Input
                      key={optionIndex}
                      value={option}
                      onChange={(e) => updateOption(optionIndex, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Question</Label>
              <p className="mt-1 text-foreground">{question.question}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground">Correct Answer</Label>
              <p className="mt-1 text-foreground font-medium">{question.answer}</p>
            </div>

            {question.options && question.options.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Answer Options</Label>
                <div className="mt-2 space-y-1">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-muted-foreground min-w-[20px]">
                        {String.fromCharCode(65 + optionIndex)}.
                      </span>
                      <span className={`text-sm ${option === question.answer ? 'font-medium text-primary' : ''}`}>
                        {option}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  )
}

export function QuestionEditList() {
  const { questions, setCurrentStep } = useQuizStore()

  const handleStartQuiz = () => {
    setCurrentStep('quiz')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Review & Edit Questions
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Review the generated questions and make any necessary edits before starting the quiz. 
          Your changes are automatically saved.
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div 
            key={question.id} 
            className="animate-in fade-in slide-in-from-bottom-2 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <QuestionEditor question={question} index={index} />
          </div>
        ))}
      </div>

      <div className="flex justify-center animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${questions.length * 100}ms` }}>
        <Button 
          onClick={handleStartQuiz} 
          size="lg" 
          className="px-12 py-4 text-lg relative overflow-hidden group transition-all duration-300 hover:scale-105"
        >
          <span className="relative z-10">Start Quiz</span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </Button>
      </div>
    </div>
  )
}