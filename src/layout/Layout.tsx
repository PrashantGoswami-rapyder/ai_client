import Sidebar from '../Components/Sidebar'

interface Chat {
  id: string
  title: string
  lastMessage?: string
}

interface LayoutProps {
  children: React.ReactNode
  onNewChat?: () => void
  chats?: Chat[]
  onChatSelect?: (chatId: string) => void
  selectedChatId?: string
  username?: string
}

const Layout = ({ children, onNewChat, chats, onChatSelect, selectedChatId, username }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        onNewChat={onNewChat}
        chats={chats}
        onChatSelect={onChatSelect}
        selectedChatId={selectedChatId}
        username={username}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}

export default Layout

