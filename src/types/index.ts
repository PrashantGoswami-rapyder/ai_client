export interface Chat {
  id: string
  title: string
  lastMessage?: string
  createdAt: number
  updatedAt: number
  messages: Message[]
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  attachments?: File[]
}

export interface PromptConfig {
  model: string
  temperature: number
  maxTokens: number
  attachments: File[]
}

export interface UserSettings {
  username: string
  theme: 'light' | 'dark'
  defaultModel: string
  defaultTemperature: number
  defaultMaxTokens: number
}

export interface AppState {
  chats: Chat[]
  selectedChatId: string | null
  settings: UserSettings
}

