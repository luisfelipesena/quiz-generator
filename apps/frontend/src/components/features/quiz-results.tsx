'use client'

import { useState, useEffect } from 'react'
import { Share, Download, Copy, RotateCcw, ChevronDown, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { SuccessIcon, BackArrowIcon } from '@/components/icons'
import { PdfIcon } from '@/components/icons/pdf-icon'
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { UserNameModal } from '@/components/features/user-name-modal'
import { QuestionCard } from './question-card'
import { ConfettiBackground } from './confetti-background'
import { useQuizStore } from '@/stores/quiz-store'
import { useShareResults } from '@/hooks/useShareResults'
import { clearSession } from '@/hooks/useSessionId'
import { useRouter } from 'next/navigation'

export function QuizResults() {
  const { questions, answers, getScore, resetQuiz, userName } = useQuizStore()
  const { correct, total } = getScore()
  const [showNameModal, setShowNameModal] = useState(false)
  const [shareMessage, setShareMessage] = useState('')
  const { shareAsText, downloadAsPDF, copyToClipboard } = useShareResults()
  const router = useRouter()

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
      
      if (result && result.success) {
        const messages: Record<string, string> = {
          native: 'Results shared successfully!',
          copy: 'Results copied to clipboard!',
          download: 'Results downloaded successfully!'
        }
        setShareMessage(messages[result.method] || 'Results shared!')
        setTimeout(() => setShareMessage(''), 3000)
      } else {
        // Show success message even if result format is different
        const messages: Record<string, string> = {
          native: 'Results shared successfully!',
          copy: 'Results copied to clipboard!',
          download: 'Results downloaded successfully!'
        }
        setShareMessage(messages[method] || 'Results shared!')
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
    // Navigate to home page with clean state
    router.push('/')
  }

  return (
    <>
      {/* Name Input Modal with React Hook Form + Zod */}
      <UserNameModal 
        isOpen={showNameModal} 
        onSuccess={handleNameModalSuccess}
      />

      <div className={`max-w-3xl mx-auto ${showNameModal ? 'blur-sm' : ''} px-4 sm:px-0 pb-32 min-h-screen`}>
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                useQuizStore.getState().setCurrentStep('quiz')
                router.push(`/quiz/${questions.length}`)
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <BackArrowIcon width={20} height={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                <PdfIcon width={16} height={16} className="text-white" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">
                Mathematics Quiz
              </h1>
            </div>
          </div>
          
          <Button
            onClick={() => toast.info('Upgrade feature coming soon!')}
            className="bg-black text-white hover:bg-gray-800 px-4 py-2 text-sm font-medium"
          >
            Upgrade
          </Button>
        </div>
        
        {/* Results Header with Confetti Background */}
        <div className="relative text-center space-y-6 py-8">
          <ConfettiBackground />
          <div className="relative z-10">
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
              
              {/* Share Results Button - Moved here */}
              <div className="mt-8">
                <DropdownMenu
                  trigger={
                    <Button 
                      className="px-6 py-3 text-base font-medium rounded-lg flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
                    >
                      <Share className="w-4 h-4" />
                      Share results
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
              </div>
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
        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Result Summary</h2>
          {questions.map((question, index) => {
            const answer = answers.find(a => a.questionId === question.id)
            if (!answer) return null

            return (
              <QuestionCard
                key={question.id}
                questionNumber={index + 1}
                question={question.question}
                options={question.options || []}
                selectedAnswer={answer.userAnswer}
                correctAnswer={answer.correctAnswer}
                showFeedback={true}
                disabled={true}
                mode="review"
              />
            )
          })}
        </div>

        {/* Fixed Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 p-4 bg-gradient-to-t from-white via-white/95 to-transparent shadow-lg z-50">
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