import { useState, useRef, useEffect } from 'react'
import { useApp } from '../hooks/useApp'
import { useToast } from './Toast'
import Tooltip from './Tooltip'

const Sidebar = () => {
  const {
    chats,
    selectedChatId,
    settings,
    addChat,
    selectChat,
    deleteChat,
    renameChat
  } = useApp()
  const { showToast } = useToast()
  
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [activeNav, setActiveNav] = useState('chats')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  useEffect(() => {
    if (editingChatId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingChatId])

  const handleNewChat = () => {
    addChat()
    setActiveNav('chats')
    showToast('New chat created', 'success')
  }

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this chat?')) {
      deleteChat(chatId)
      showToast('Chat deleted', 'info')
    }
  }

  const handleStartEdit = (e: React.MouseEvent, chatId: string, currentTitle: string) => {
    e.stopPropagation()
    setEditingChatId(chatId)
    setEditTitle(currentTitle)
  }

  const handleSaveEdit = (chatId: string) => {
    if (editTitle.trim()) {
      renameChat(chatId, editTitle.trim())
      showToast('Chat renamed', 'success')
    }
    setEditingChatId(null)
    setEditTitle('')
  }

  const handleCancelEdit = () => {
    setEditingChatId(null)
    setEditTitle('')
  }

  const handleKeyDown = (e: React.KeyboardEvent, chatId: string) => {
    if (e.key === 'Enter') {
      handleSaveEdit(chatId)
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <aside className={`bg-gray-800 text-white shadow-lg flex flex-col transition-all duration-300 relative ${
      isCollapsed ? 'w-16' : 'w-56'
    }`}>
      {isCollapsed ? (
        <>
          {/* Collapsed Sidebar */}
          <div className="p-3 border-b border-gray-700">
            {/* Toggle Button at Top */}
            <Tooltip label="Expand sidebar" position="right">
              <button
                onClick={toggleCollapse}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-700 rounded-lg transition-colors mx-auto"
                aria-label="Expand sidebar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </Tooltip>
          </div>

          {/* Navigation Icons */}
          <div className="flex flex-col items-center py-4 space-y-6 flex-1">
            {/* New Chat */}
            <Tooltip label="New chat" position="right">
              <button
                onClick={handleNewChat}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
              </button>
            </Tooltip>

            {/* Search */}
            <Tooltip label="Search chats" position="right">
              <button
                onClick={() => setActiveNav('search')}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </Tooltip>
          </div>

          {/* Bottom Section - User Profile */}
          <div className="border-t border-gray-700 p-3">
            <Tooltip label={`${settings.username} - ${settings.username.split(' ').map(n => n[0]).join('').toUpperCase()}`} position="right">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors mx-auto"
              >
                <span className="text-sm font-semibold text-white">
                  {settings.username.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </button>
            </Tooltip>
          </div>
        </>
      ) : (
        <>
          {/* Expanded Sidebar */}
          <div className="border-b border-gray-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold truncate cursor-default">Logo</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleCollapse}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors shrink-0"
                  aria-label="Collapse sidebar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          {!isCollapsed && (
            <div className="border-b border-gray-700 px-4 py-3">
              <div className="space-y-1">
                {/* New Chat Button */}
                <button
                  onClick={() => {
                    handleNewChat()
                    setActiveNav('new-chat')
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                    activeNav === 'new-chat' ? 'bg-gray-700/80' : 'hover:bg-gray-700/50'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  <span className="text-sm font-medium">New chat</span>
                </button>

                {/* Search chats */}
                <button
                  onClick={() => setActiveNav('search')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                    activeNav === 'search' ? 'bg-gray-700/80' : 'hover:bg-gray-700/50'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <span className="text-sm">Search chats</span>
                </button>

              </div>
            </div>
          )}

          {/* Your Chats Section */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3 px-2">Your chats</h3>
            <div className="space-y-1">
              {chats.length === 0 ? (
                <p className="text-gray-500 text-sm px-2 py-4 text-center">
                  No chats yet
                </p>
              ) : (
                chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group relative w-full rounded-lg transition-colors ${
                    selectedChatId === chat.id
                      ? 'bg-gray-700 text-white'
                      : 'hover:bg-gray-700/50 text-gray-300'
                  }`}
                >
                  {editingChatId === chat.id ? (
                    <div className="flex items-center gap-2 p-2">
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleSaveEdit(chat.id)}
                        onKeyDown={(e) => handleKeyDown(e, chat.id)}
                        className="flex-1 px-2 py-1 bg-gray-600 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          selectChat(chat.id)
                          setActiveNav('chats')
                        }}
                        className="w-full flex items-center gap-2 p-2.5 rounded-lg transition-colors"
                      >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm font-medium truncate">{chat.title}</p>
                          </div>
                        </button>
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 flex gap-1">
                        <button
                          onClick={(e) => handleStartEdit(e, chat.id, chat.title)}
                          className="p-1 hover:bg-gray-600 rounded transition-colors"
                          aria-label="Rename chat"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={(e) => handleDeleteChat(e, chat.id)}
                          className="p-1 hover:bg-gray-600 rounded text-red-400 transition-colors"
                          aria-label="Delete chat"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
              )}
            </div>
          </div>

          {/* User Profile Section */}
          <div className="border-t border-gray-700 p-3">
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-white">
                    {settings.username.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{settings.username}</p>
                  <p className="text-xs text-gray-400">Free</p>
                </div>
              </div>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
              >
                Upgrade
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 transition-colors flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 transition-colors flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path>
                    </svg>
                    Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 transition-colors flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </aside>
  )
}

export default Sidebar
