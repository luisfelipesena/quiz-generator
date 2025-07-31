import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'

interface StreamingFeedbackRequest {
  questionId: string
  userAnswer: string
}

interface StreamingFeedbackState {
  feedback: string
  isStreaming: boolean
  error: string | null
}

export function useStreamingFeedback() {
  const [state, setState] = useState<StreamingFeedbackState>({
    feedback: '',
    isStreaming: false,
    error: null,
  })

  const streamingMutation = useMutation({
    mutationFn: async ({ questionId, userAnswer }: StreamingFeedbackRequest) => {
      setState(prev => ({ ...prev, isStreaming: true, feedback: '', error: null }))

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/quiz/check-answer-stream`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              question_id: questionId,
              user_answer: userAnswer,
            }),
          }
        )

        if (!response.ok) {
          throw new Error('Failed to get streaming feedback')
        }

        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('No response body')
        }

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || '' // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim()
              if (data === '[DONE]') {
                setState(prev => ({ ...prev, isStreaming: false }))
                return
              }
              if (data) {
                setState(prev => ({ ...prev, feedback: prev.feedback + data }))
              }
            }
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        setState(prev => ({ 
          ...prev, 
          isStreaming: false, 
          error: errorMessage 
        }))
        throw error
      }
    },
  })

  const resetState = useCallback(() => {
    setState({
      feedback: '',
      isStreaming: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    startStreaming: streamingMutation.mutate,
    isLoading: streamingMutation.isPending,
    reset: resetState,
  }
}