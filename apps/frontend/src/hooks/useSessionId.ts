import { useEffect, useState } from 'react'
import { getCookie, setCookie, deleteCookie } from 'cookies-next'

/**
 * Hook to generate and persist a unique session ID in cookies using cookies-next
 */
export function useSessionId(): string {
  const [sessionId, setSessionId] = useState<string>('')

  useEffect(() => {
    // Try to get existing session ID from cookies
    let existingSessionId = getCookie('quiz-session-id') as string | undefined
    
    if (!existingSessionId) {
      // Generate a new UUID-like session ID
      existingSessionId = crypto.randomUUID()
      
      // Set cookie with proper options for security and persistence
      setCookie('quiz-session-id', existingSessionId, {
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production', // Only secure in production (HTTPS)
        httpOnly: false, // Must be false for client-side access
      })
    }
    
    setSessionId(existingSessionId)
  }, [])

  return sessionId
}

/**
 * Utility function to get session ID directly
 */
export const getSessionId = (): string | undefined => {
  return getCookie('quiz-session-id') as string | undefined
}

/**
 * Utility function to clear session (logout/reset functionality)
 */
export const clearSession = (): void => {
  deleteCookie('quiz-session-id', {
    path: '/',
  })
}