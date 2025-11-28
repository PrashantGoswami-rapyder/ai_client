import { createContext } from 'react'
import type { Chat, Message, UserSettings } from '../types'

export interface AppContextType {
  chats: Chat[]
  selectedChat: Chat | null
  selectedChatId: string | null
  settings: UserSettings
  addChat: (title?: string) => Chat
  selectChat: (chatId: string | null) => void
  deleteChat: (chatId: string) => void
  renameChat: (chatId: string, newTitle: string) => void
  addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => void
  updateSettings: (settings: Partial<UserSettings>) => void
  searchChats: (query: string) => Chat[]
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

// Re-export AppProvider from the component file
export { AppProvider } from './AppContext.tsx'

