import { useState } from 'react'

interface TooltipProps {
  children: React.ReactNode
  label: string
  position?: 'left' | 'right' | 'top' | 'bottom'
  fullWidth?: boolean
}

const Tooltip = ({ children, label, position = 'right', fullWidth = false }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2'
  }

  return (
    <div
      className={`relative ${fullWidth ? 'block' : 'inline-block'}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-lg whitespace-nowrap pointer-events-none ${positionClasses[position]}`}
        >
          {label}
          <div
            className={`absolute w-0 h-0 border-4 ${
              position === 'right'
                ? 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 border-t-transparent border-b-transparent border-l-transparent'
                : position === 'left'
                ? 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 border-t-transparent border-b-transparent border-r-transparent'
                : position === 'top'
                ? 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-l-transparent border-r-transparent border-b-transparent'
                : 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 border-l-transparent border-r-transparent border-t-transparent'
            }`}
          />
        </div>
      )}
    </div>
  )
}

export default Tooltip

