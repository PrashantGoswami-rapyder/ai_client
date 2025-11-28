interface PlaceholderButton {
  label: string
  prompt: string
  icon?: React.ReactNode
}

interface PlaceholderButtonsProps {
  onSelect: (prompt: string) => void
}

const placeholderPrompts: PlaceholderButton[] = [
  {
    label: 'Write an email',
    prompt: 'Write a professional email about',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
      </svg>
    )
  },
  {
    label: 'Explain concept',
    prompt: 'Explain the concept of',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    )
  },
  {
    label: 'Code review',
    prompt: 'Review this code and suggest improvements:',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    )
  },
  {
    label: 'Summarize',
    prompt: 'Summarize the following:',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    )
  }
]

const PlaceholderButtons = ({ onSelect }: PlaceholderButtonsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
      {placeholderPrompts.map((item, index) => (
        <button
          key={index}
          onClick={() => onSelect(item.prompt)}
          className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors text-left group"
        >
          <div className="text-gray-600 group-hover:text-blue-600 transition-colors">
            {item.icon}
          </div>
          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  )
}

export default PlaceholderButtons

