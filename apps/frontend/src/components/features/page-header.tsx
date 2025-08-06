'use client'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { BackArrowIcon } from '@/components/icons'
import { PdfIcon } from '@/components/icons/pdf-icon'

interface PageHeaderProps {
  title: string
  onBack: () => void
}

export function PageHeader({ title, onBack }: PageHeaderProps) {
  const handleUpgradeClick = () => {
    toast.info('Upgrade feature coming soon!')
  }

  return (
    <div className="flex items-center justify-between w-full py-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <BackArrowIcon width={20} height={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
            <PdfIcon width={16} height={16} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">
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