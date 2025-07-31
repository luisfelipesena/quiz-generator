import React from 'react'

interface PdfIconProps {
  width?: number
  height?: number
  className?: string
}

export function PdfIcon({ width = 64, height = 64, className }: PdfIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="12" y="8" width="40" height="48" rx="4" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="2"/>
      <rect x="16" y="12" width="32" height="4" rx="2" fill="#9CA3AF"/>
      <rect x="16" y="20" width="32" height="2" rx="1" fill="#D1D5DB"/>
      <rect x="16" y="24" width="24" height="2" rx="1" fill="#D1D5DB"/>
      <rect x="16" y="28" width="28" height="2" rx="1" fill="#D1D5DB"/>
      <rect x="16" y="32" width="20" height="2" rx="1" fill="#D1D5DB"/>
      <rect x="34" y="42" width="10" height="8" rx="2" fill="#DC2626"/>
      <text x="39" y="48" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle">PDF</text>
    </svg>
  )
}