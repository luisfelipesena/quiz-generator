import React from 'react'

interface StarIconProps {
  width?: number
  height?: number
  className?: string
}

export function StarIcon({ width = 16, height = 16, className }: StarIconProps) {
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
        d="M8 0L9.18 3.04L12.66 3.04L9.82 5.29L10.99 8.33L8 6.08L5.01 8.33L6.18 5.29L3.34 3.04L6.82 3.04L8 0Z" 
        fill="currentColor"
      />
    </svg>
  )
}