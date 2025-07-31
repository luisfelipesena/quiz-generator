import React from 'react'

interface ChevronDownIconProps {
  width?: number
  height?: number
  className?: string
}

export function ChevronDownIcon({ width = 16, height = 16, className }: ChevronDownIconProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M4 6L8 10L12 6" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}