import React from 'react'

interface SuccessIconProps {
  width?: number
  height?: number
  className?: string
}

export function SuccessIcon({ width = 96, height = 96, className }: SuccessIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="48" cy="48" r="44" fill="#10B981" fillOpacity="0.1"/>
      <circle cx="48" cy="48" r="32" fill="#10B981" fillOpacity="0.2"/>
      <circle cx="48" cy="48" r="20" fill="#10B981"/>
      <path
        d="M40 48L44 52L56 40"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}