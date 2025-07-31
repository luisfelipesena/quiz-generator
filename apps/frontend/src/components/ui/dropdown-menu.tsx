import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function DropdownMenu({ trigger, children, className }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className={cn("relative inline-block", className)} ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
      </div>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

interface DropdownMenuItemProps {
  onClick: () => void
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

export function DropdownMenuItem({ onClick, children, className, icon }: DropdownMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left",
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  )
}