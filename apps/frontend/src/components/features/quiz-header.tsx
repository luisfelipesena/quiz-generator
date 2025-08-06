'use client'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { BackArrowIcon } from '@/components/icons'
import { PdfIcon } from '@/components/icons/pdf-icon'

interface QuizHeaderProps {
  title: string
  onBack: () => void
  showBackArrow?: boolean
}

export function QuizHeader({ title, onBack, showBackArrow = true }: QuizHeaderProps) {
  const handleUpgradeClick = () => {
    toast.info('Upgrade feature coming soon!')
  }

  return (
    <div className="flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-sm z-10 py-4">
      <div className="flex items-center gap-3">
        {showBackArrow && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <BackArrowIcon width={20} height={20} />
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
            <PdfIcon width={16} height={16} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">
            {title}
          </h1>
        </div>
      </div>
      <Button
        onClick={handleUpgradeClick}
        className="bg-black text-white hover:bg-gray-800 px-4 py-2 text-sm font-medium"
      >
        Upgrade
      </Button>
    </div>
  )
}