import React from 'react'

interface DropPdfIconProps {
  width?: number
  height?: number
  className?: string
}

export function DropPdfIcon({ width = 64, height = 64, className }: DropPdfIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="16" y="8" width="32" height="40" rx="2" fill="#F8F9FA" stroke="#E9ECEF" strokeWidth="1"/>
      <rect x="20" y="12" width="24" height="3" rx="1.5" fill="#CED4DA"/>
      <rect x="20" y="18" width="24" height="1.5" rx="0.75" fill="#E9ECEF"/>
      <rect x="20" y="22" width="18" height="1.5" rx="0.75" fill="#E9ECEF"/>
      <rect x="20" y="26" width="20" height="1.5" rx="0.75" fill="#E9ECEF"/>
      <rect x="20" y="30" width="16" height="1.5" rx="0.75" fill="#E9ECEF"/>
      <rect x="34" y="38" width="8" height="6" rx="1" fill="#6D56FA"/>
      <text x="38" y="43" fill="white" fontSize="4" fontWeight="600" textAnchor="middle">PDF</text>
    </svg>
  )
}