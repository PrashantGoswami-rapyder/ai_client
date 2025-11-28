import { AppProvider } from './context/AppContext'
import { ToastProvider } from './Components/Toast'
import Layout from './layout/Layout'
import PromptInput from './page/PromptInput'

const App = () => {
  return (
    <AppProvider>
      <ToastProvider>
        <Layout>
          <PromptInput />
        </Layout>
      </ToastProvider>
    </AppProvider>
  )
}

export default App