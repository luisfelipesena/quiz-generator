import { useEffect } from 'react'
import { useQuizStore } from '@/stores/quiz-store'
import { api } from '@/lib/api'
import { useSessionId } from './useSessionId'

export function useSyncQuizState() {
  const { questions, quizTitle } = useQuizStore()
  const sessionId = useSessionId()

  useEffect(() => {
    const syncState = async () => {
      if (questions.length > 0 && sessionId) {
        try {
          await api.syncQuestions(questions, sessionId, quizTitle)
        } catch (error) {
          console.error('Failed to sync quiz state with server:', error)
        }
      }
    }

    syncState()
  }, [questions, sessionId, quizTitle])
} 