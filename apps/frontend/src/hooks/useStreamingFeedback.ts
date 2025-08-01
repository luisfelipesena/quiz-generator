import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { type QuestionAnswer } from '@/lib/api'

interface StreamingFeedbackRequest {
  questionId: string
  userAnswer: string
  questions: QuestionAnswer[]
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
    mutationFn: async ({ questionId, userAnswer, questions }: StreamingFeedbackRequest) => {
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
              questions: questions,
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
        let accumulatedFeedback = ''
        let updateTimeoutId: NodeJS.Timeout | null = null

        // Function to update UI with accumulated feedback
        const updateFeedback = () => {
          setState(prev => ({ 
            ...prev, 
            feedback: accumulatedFeedback.replace(/\s+/g, ' ').trim() // Clean up extra spaces
          }))
        }

        // Batch updates to avoid too frequent re-renders
        const debouncedUpdate = (immediate = false) => {
          if (updateTimeoutId) {
            clearTimeout(updateTimeoutId)
          }
          
          if (immediate) {
            updateFeedback()
          } else {
            updateTimeoutId = setTimeout(updateFeedback, 50) // Update every 50ms
          }
        }

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
                setState(prev => ({ ...prev, isStreaming: false, feedback: accumulatedFeedback.replace(/\s+/g, ' ').trim() }))
                if (updateTimeoutId) clearTimeout(updateTimeoutId)
                return
              }
              if (data) {
                // Smart spacing: only add space if needed
                if (accumulatedFeedback && 
                    !accumulatedFeedback.endsWith(' ') && 
                    !accumulatedFeedback.endsWith('\n') &&
                    !data.startsWith(' ') &&
                    !data.match(/^[,.!?;:]/) && // Don't add space before punctuation
                    !accumulatedFeedback.match(/[-"'(]$/)) { // Don't add space after certain chars
                  accumulatedFeedback += ' '
                }
                accumulatedFeedback += data
                debouncedUpdate()
              }
            }
          }
        }
        
        // Final cleanup
        if (updateTimeoutId) clearTimeout(updateTimeoutId)
        updateFeedback()
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
    // Also reset any ongoing streaming mutation
    streamingMutation.reset()
  }, [streamingMutation])

  return {
    ...state,
    startStreaming: streamingMutation.mutate,
    isLoading: streamingMutation.isPending,
    reset: resetState,
  }
}