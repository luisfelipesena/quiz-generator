import React from 'react'

interface TransitionIconProps {
  width?: number
  height?: number
  className?: string
}

export function TransitionIcon({ width = 120, height = 120, className }: TransitionIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Animated loading rings */}
      <circle
        cx="60"
        cy="60"
        r="45"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.2"
      />
      <circle
        cx="60"
        cy="60"
        r="35"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.4"
        strokeDasharray="20 10"
        className="animate-spin"
        style={{ animationDuration: '3s' }}
      />
      <circle
        cx="60"
        cy="60"
        r="25"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeDasharray="15 5"
        className="animate-spin"
        style={{ animationDuration: '2s', animationDirection: 'reverse' }}
      />
      
      {/* Center icon */}
      <g transform="translate(45, 45)">
        <rect x="2" y="2" width="26" height="26" rx="2" fill="currentColor" opacity="0.8"/>
        <rect x="5" y="5" width="20" height="3" rx="1" fill="white"/>
        <rect x="5" y="10" width="20" height="1" rx="0.5" fill="white" opacity="0.7"/>
        <rect x="5" y="13" width="15" height="1" rx="0.5" fill="white" opacity="0.7"/>
        <rect x="5" y="16" width="18" height="1" rx="0.5" fill="white" opacity="0.7"/>
        <rect x="5" y="19" width="12" height="1" rx="0.5" fill="white" opacity="0.7"/>
      </g>
    </svg>
  )
}