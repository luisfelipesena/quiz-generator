import { z } from 'zod'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Schemas
export const QuestionAnswerSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  options: z.array(z.string()).optional(),
})

export const QuizResponseSchema = z.object({
  questions: z.array(QuestionAnswerSchema),
})

export const AnswerRequestSchema = z.object({
  question_id: z.string(),
  user_answer: z.string(),
})

export const AnswerResponseSchema = z.object({
  correct: z.boolean(),
  correct_answer: z.string(),
  explanation: z.string().optional(),
})

// Types
export type QuestionAnswer = z.infer<typeof QuestionAnswerSchema>
export type QuizResponse = z.infer<typeof QuizResponseSchema>
export type AnswerRequest = z.infer<typeof AnswerRequestSchema>
export type AnswerResponse = z.infer<typeof AnswerResponseSchema>

// API functions
export const api = {
  uploadPdf: async (file: File): Promise<QuizResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/upload-pdf`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to upload PDF')
    }

    const data = await response.json()
    return QuizResponseSchema.parse(data)
  },

  updateQuestion: async (questionId: string, question: QuestionAnswer): Promise<QuestionAnswer> => {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(question),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to update question')
    }

    const data = await response.json()
    return QuestionAnswerSchema.parse(data)
  },

  checkAnswer: async (answerRequest: AnswerRequest): Promise<AnswerResponse> => {
    const response = await fetch(`${API_BASE_URL}/check-answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(answerRequest),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to check answer')
    }

    const data = await response.json()
    return AnswerResponseSchema.parse(data)
  },
}