import { useState } from 'react'
import Layout from './layout/Layout'
import PromptInput from './page/PromptInput'
import type { PromptConfig } from './hooks/usePrompt'

interface Chat {
  id: string
  title: string
  lastMessage?: string
}

const App = () => {
  const [chats, setChats] = useState<Chat[]>([
    { id: '1', title: 'Chat 1', lastMessage: 'Last message preview...' },
    { id: '2', title: 'Chat 2', lastMessage: 'Another message...' }
  ])
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>()

  const handleSubmit = async (prompt: string, config: PromptConfig) => {
    console.log('Prompt:', prompt)
    console.log('Config:', config)
    // Add your API call here
  }

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: `Chat ${chats.length + 1}`,
      lastMessage: undefined
    }
    setChats(prev => [newChat, ...prev])
    setSelectedChatId(newChat.id)
  }

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId)
  }

  return (
    <Layout
      onNewChat={handleNewChat}
      chats={chats}
      onChatSelect={handleChatSelect}
      selectedChatId={selectedChatId}
      username="John Doe"
    >
      <PromptInput onSubmit={handleSubmit} />
    </Layout>
  )
}

export default App