'use client'

import { TransitionIcon } from '@/components/icons'

interface LoadingTransitionProps {
  title: string
  subtitle: string
}

export function LoadingTransition({ title, subtitle }: LoadingTransitionProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-8">
        {/* Animated transition icon */}
        <div className="flex justify-center">
          <TransitionIcon 
            width={120} 
            height={120} 
            className="text-primary animate-pulse" 
          />
        </div>
        
        {/* Loading content */}
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">
            {title}
          </h1>
          <p className="text-base text-muted-foreground">
            {subtitle}
          </p>
        </div>
        
        {/* Progress dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  )
}