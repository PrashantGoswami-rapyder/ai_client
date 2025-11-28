import { useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { Chat, Message, UserSettings } from '../types'
import { AppContext } from './AppContext'

const STORAGE_KEYS = {
  CHATS: 'agent_client_chats',
  SETTINGS: 'agent_client_settings',
  SELECTED_CHAT: 'agent_client_selected_chat'
}

const defaultSettings: UserSettings = {
  username: 'User',
  theme: 'light',
  defaultModel: 'gpt-4',
  defaultTemperature: 0.7,
  defaultMaxTokens: 2000
}

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Failed to save to localStorage: ${key}`, error)
  }
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>(() => loadFromStorage(STORAGE_KEYS.CHATS, []))
  const [selectedChatId, setSelectedChatId] = useState<string | null>(() => 
    loadFromStorage(STORAGE_KEYS.SELECTED_CHAT, null)
  )
  const [settings, setSettings] = useState<UserSettings>(() => 
    loadFromStorage(STORAGE_KEYS.SETTINGS, defaultSettings)
  )

  // Persist chats to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CHATS, chats)
  }, [chats])

  // Persist selected chat
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SELECTED_CHAT, selectedChatId)
  }, [selectedChatId])

  // Persist settings
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings)
  }, [settings])

  const addChat = useCallback((title?: string): Chat => {
    const newChat: Chat = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: title || `Chat ${chats.length + 1}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: []
    }
    setChats(prev => [newChat, ...prev])
    setSelectedChatId(newChat.id)
    return newChat
  }, [chats.length])

  const selectChat = useCallback((chatId: string | null) => {
    setSelectedChatId(chatId)
  }, [])

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId))
    if (selectedChatId === chatId) {
      setSelectedChatId(null)
    }
  }, [selectedChatId])

  const renameChat = useCallback((chatId: string, newTitle: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, title: newTitle, updatedAt: Date.now() }
        : chat
    ))
  }, [])

  const addMessage = useCallback((chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    }

    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        const updatedChat = {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: newMessage.content.substring(0, 50),
          updatedAt: Date.now()
        }
        // Auto-generate title from first user message if no title set
        if (!chat.title || chat.title.startsWith('Chat ')) {
          if (newMessage.role === 'user') {
            updatedChat.title = newMessage.content.substring(0, 30) || updatedChat.title
          }
        }
        return updatedChat
      }
      return chat
    }))
  }, [])

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  const searchChats = useCallback((query: string): Chat[] => {
    if (!query.trim()) return chats
    const lowerQuery = query.toLowerCase()
    return chats.filter(chat => 
      chat.title.toLowerCase().includes(lowerQuery) ||
      chat.lastMessage?.toLowerCase().includes(lowerQuery) ||
      chat.messages.some(msg => msg.content.toLowerCase().includes(lowerQuery))
    )
  }, [chats])

  const selectedChat = chats.find(chat => chat.id === selectedChatId) || null

  return (
    <AppContext.Provider
      value={{
        chats,
        selectedChat,
        selectedChatId,
        settings,
        addChat,
        selectChat,
        deleteChat,
        renameChat,
        addMessage,
        updateSettings,
        searchChats
      }}
    >
      {children}
    </AppContext.Provider>
  )
}


