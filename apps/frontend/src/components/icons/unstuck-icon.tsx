import React from 'react'

interface UnstuckIconProps {
  width?: number
  height?: number
  className?: string
}

export function UnstuckIcon({ width = 32, height = 32, className }: UnstuckIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16 2L17.545 10.426L26 8L17.09 10.228L26 16L17.545 13.774L16 22L14.455 13.774L6 16L14.91 13.772L6 8L14.455 10.426L16 2Z"
        fill="currentColor"
      />
    </svg>
  )
}