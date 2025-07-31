'use client'

import { useState, useEffect } from 'react'
import { Check, X, Share, Download, Copy, RotateCcw, ChevronDown } from 'lucide-react'
import { ChevronDownIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { SuccessIcon } from '@/components/icons'
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { UserNameModal } from '@/components/features/user-name-modal'
import { useQuizStore } from '@/stores/quiz-store'
import { useShareResults } from '@/hooks/useShareResults'
import { clearSession } from '@/hooks/useSessionId'

export function QuizResults() {
  const { questions, answers, getScore, resetQuiz, userName } = useQuizStore()
  const { correct, total } = getScore()
  const [showNameModal, setShowNameModal] = useState(false)
  const [shareMessage, setShareMessage] = useState('')
  const { shareAsText, downloadAsPDF, copyToClipboard } = useShareResults()

  // Show name modal if user name is not set
  useEffect(() => {
    if (!userName.trim()) {
      setShowNameModal(true)
    }
  }, [userName])

  const handleNameModalSuccess = () => {
    setShowNameModal(false)
  }

  const getFirstName = () => {
    return userName.split(' ')[0] || userName
  }

  const handleShare = async (method: 'native' | 'download' | 'copy') => {
    try {
      let result
      switch (method) {
        case 'native':
          result = await shareAsText()
          break
        case 'download':
          result = downloadAsPDF()
          break
        case 'copy':
          result = await copyToClipboard()
          break
      }
      
      if (result.success) {
        const messages: Record<string, string> = {
          native: 'Results shared successfully!',
          clipboard: 'Results copied to clipboard!',
          download: 'Results downloaded successfully!'
        }
        setShareMessage(messages[result.method] || 'Results shared!')
        setTimeout(() => setShareMessage(''), 3000)
      }
    } catch (error) {
      console.error('Share failed:', error)
      setShareMessage('Failed to share results')
      setTimeout(() => setShareMessage(''), 3000)
    }
  }

  const handleTakeAnotherQuiz = () => {
    resetQuiz()
    clearSession()
    // Full page reload to ensure a clean state and new session
    window.location.reload()
  }

  return (
    <>
      {/* Name Input Modal with React Hook Form + Zod */}
      <UserNameModal 
        isOpen={showNameModal} 
        onSuccess={handleNameModalSuccess}
      />

      <div className={`max-w-3xl mx-auto ${showNameModal ? 'blur-sm' : ''} px-4 sm:px-0 pb-32`}>
        {/* Results Header */}
        <div className="text-center space-y-6 py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24">
            <SuccessIcon 
              width={80} 
              height={80} 
              className="text-green-600 sm:w-24 sm:h-24" 
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl sm:text-3xl font-semibold text-foreground px-4">
              Great Work {getFirstName()}, you did very good on your quiz.
            </h1>
            <div className="text-4xl sm:text-5xl font-bold text-foreground mt-4">
              {correct}/{total}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-600">Answered Correctly</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-sm text-gray-600">Missed Answers</span>
              </div>
            </div>
            <div className="relative w-full max-w-md mx-auto h-3 bg-gray-200 rounded-full overflow-hidden mt-4">
              <div
                className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-1000"
                style={{ width: `${(correct / total) * 100}%` }}
              />
              <div
                className="absolute right-0 top-0 h-full bg-red-500 transition-all duration-1000"
                style={{ width: `${((total - correct) / total) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Share Success Message */}
        {shareMessage && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">{shareMessage}</span>
            </div>
          </div>
        )}

        {/* Result Summary */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Result Summary</h2>
          <div className="space-y-3">
            {questions.map((question, index) => {
              const answer = answers.find(a => a.questionId === question.id)
              if (!answer) return null

              return (
                <details key={question.id} className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600">Question {index + 1}</span>
                      {answer.isCorrect ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <Check className="w-4 h-4" />
                          <span className="text-sm">Correct Answer</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <X className="w-4 h-4" />
                          <span className="text-sm">Wrong Answer</span>
                        </div>
                      )}
                    </div>
                    <ChevronDownIcon className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="mt-3 px-3 pb-3 space-y-3">
                    <p className="text-sm text-gray-700">{question.question}</p>
                    {!answer.isCorrect && (
                      <p className="text-sm text-gray-600">
                        Correct answer: <span className="font-medium text-gray-900">{answer.correctAnswer}</span>
                      </p>
                    )}
                  </div>
                </details>
              )
            })}
          </div>
        </div>

        {/* Fixed Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 p-4 bg-white border-t border-gray-200 shadow-lg z-50">
          <DropdownMenu
            trigger={
              <Button 
                size="lg"
                className="px-6 py-3 text-base font-medium rounded-lg flex items-center gap-2 w-full sm:w-auto"
              >
                <Share className="w-4 h-4" />
                Share results
                <ChevronDown className="w-4 h-4" />
              </Button>
            }
          >
            <DropdownMenuItem 
              onClick={() => handleShare('native')}
              icon={<Share className="w-4 h-4" />}
            >
              Share via system
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleShare('copy')}
              icon={<Copy className="w-4 h-4" />}
            >
              Copy to clipboard
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleShare('download')}
              icon={<Download className="w-4 h-4" />}
            >
              Download as file
            </DropdownMenuItem>
          </DropdownMenu>
          
          <Button 
            onClick={handleTakeAnotherQuiz}
            variant="outline"
            size="lg"
            className="px-6 py-3 text-base font-medium rounded-lg flex items-center gap-2 w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Take Another Quiz
          </Button>
        </div>
      </div>
    </>
  )
}