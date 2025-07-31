import { z } from 'zod'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// ============================================================================
// API Schemas - Matching backend DTOs exactly
// ============================================================================

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

export const QuestionUpdateRequestSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  options: z.array(z.string()).optional(),
})

export const PdfUploadResponseSchema = z.object({
  success: z.boolean(),
  text_extracted: z.string(),
  file_name: z.string(),
  file_size: z.number(),
})

export const ErrorResponseSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
  details: z.record(z.string(), z.unknown()).optional(),
})

export const HealthCheckResponseSchema = z.object({
  status: z.string(),
  version: z.string(),
  timestamp: z.string(),
})

// ============================================================================
// TypeScript Types - Inferred from Zod schemas
// ============================================================================

export type QuestionAnswer = z.infer<typeof QuestionAnswerSchema>
export type QuizResponse = z.infer<typeof QuizResponseSchema>
export type AnswerRequest = z.infer<typeof AnswerRequestSchema>
export type AnswerResponse = z.infer<typeof AnswerResponseSchema>
export type QuestionUpdateRequest = z.infer<typeof QuestionUpdateRequestSchema>
export type PdfUploadResponse = z.infer<typeof PdfUploadResponseSchema>
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>
export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>

// ============================================================================
// API Error Handling
// ============================================================================

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleApiResponse<T>(response: Response, schema: z.ZodSchema<T>): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`
    let errorCode: string | undefined
    let errorDetails: Record<string, unknown> | undefined

    try {
      const errorData = await response.json()
      if (errorData.error) {
        errorMessage = errorData.error
        errorCode = errorData.code
        errorDetails = errorData.details
      } else if (errorData.detail) {
        // FastAPI default error format
        errorMessage = errorData.detail
      }
    } catch {
      // Ignore JSON parsing errors, use default message
    }

    throw new ApiError(errorMessage, response.status, errorCode, errorDetails)
  }

  const data = await response.json()
  return schema.parse(data)
}

// ============================================================================
// API Functions - Fully typed with new architecture
// ============================================================================

export const api = {
  // ========================================================================
  // Health & General
  // ========================================================================
  
  async healthCheck(): Promise<HealthCheckResponse> {
    const response = await fetch(`${API_BASE_URL}/health`)
    return handleApiResponse(response, HealthCheckResponseSchema)
  },

  // ========================================================================
  // PDF Processing
  // ========================================================================
  
  async extractTextFromPdf(file: File): Promise<PdfUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/pdf/extract-text`, {
      method: 'POST',
      body: formData,
    })

    return handleApiResponse(response, PdfUploadResponseSchema)
  },

  // ========================================================================
  // Quiz Management  
  // ========================================================================
  
  async uploadPdfAndGenerateQuiz(file: File, sessionId?: string): Promise<QuizResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const headers: Record<string, string> = {}
    if (sessionId) {
      headers['X-Session-Id'] = sessionId
    }

    const response = await fetch(`${API_BASE_URL}/quiz/upload-pdf`, {
      method: 'POST',
      headers,
      body: formData,
    })

    return handleApiResponse(response, QuizResponseSchema)
  },

  async updateQuestion(questionId: string, questionUpdate: QuestionUpdateRequest, sessionId?: string): Promise<QuestionAnswer> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (sessionId) {
      headers['X-Session-Id'] = sessionId
    }

    const response = await fetch(`${API_BASE_URL}/quiz/questions/${questionId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(questionUpdate),
    })

    return handleApiResponse(response, QuestionAnswerSchema)
  },

  async checkAnswer(answerRequest: AnswerRequest, sessionId?: string): Promise<AnswerResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (sessionId) {
      headers['X-Session-Id'] = sessionId
    }

    const response = await fetch(`${API_BASE_URL}/quiz/check-answer`, {
      method: 'POST',
      headers,
      body: JSON.stringify(answerRequest),
    })

    return handleApiResponse(response, AnswerResponseSchema)
  },

  // ========================================================================
  // Legacy Methods (for backward compatibility - will be removed)
  // ========================================================================
  
  /** @deprecated Use uploadPdfAndGenerateQuiz instead */
  uploadPdf: async (file: File): Promise<QuizResponse> => {
    console.warn('api.uploadPdf is deprecated. Use api.uploadPdfAndGenerateQuiz instead.')
    return api.uploadPdfAndGenerateQuiz(file)
  },
}

// ============================================================================
// API Configuration & Utils
// ============================================================================

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
} as const

export type ApiConfigType = typeof API_CONFIG