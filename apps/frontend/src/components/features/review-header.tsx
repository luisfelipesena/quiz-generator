'use client'

import { Button } from '@/components/ui/button'
import { BackArrowIcon } from '@/components/icons'
import { UnstuckIcon } from '@/components/icons'

interface ReviewHeaderProps {
  title: string
  onBack: () => void
}

export function ReviewHeader({ title, onBack }: ReviewHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full py-4">
      <button
        onClick={onBack}
        className="text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm font-medium"
      >
        <BackArrowIcon width={16} height={16} />
        Back
      </button>
      
      <div className="flex items-center gap-3 absolute left-1/2 transform -translate-x-1/2">
        <UnstuckIcon 
          width={24} 
          height={24} 
          className="text-primary" 
        />
        <h1 className="text-xl font-semibold text-gray-900">
          {title}
        </h1>
      </div>
    </div>
  )
}