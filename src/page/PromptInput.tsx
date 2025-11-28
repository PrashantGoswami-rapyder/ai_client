import { usePrompt } from '../hooks/usePrompt'
import type { PromptConfig } from '../hooks/usePrompt'
import ModelSelector from '../Components/ModelSelector'
import AttachmentUpload from '../Components/AttachmentUpload'

interface PromptInputProps {
  onSubmit?: (prompt: string, config: PromptConfig) => Promise<void>
}

const PromptInput = ({ onSubmit }: PromptInputProps) => {
  const {
    input,
    setInput,
    isLoading,
    config,
    setConfig,
    inputRef,
    handleSend,
    handleKeyPress,
    handleAttachment,
    removeAttachment
  } = usePrompt(onSubmit)

  return (
    <div className="flex items-center justify-center h-full bg-white px-4">
      <div className="w-full max-w-4xl">
        {/* Prompt Input */}
        <div className="flex items-end gap-3 bg-white rounded-2xl border-2 border-gray-300 shadow-lg focus-within:border-blue-500 focus-within:shadow-xl transition-all">
          <div className="flex-1 flex flex-col">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter your prompt..."
              rows={1}
              className="flex-1 resize-none bg-transparent px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none max-h-40 overflow-y-auto text-lg"
              style={{ minHeight: '56px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="m-2 p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shrink-0"
            aria-label="Send prompt"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
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
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
          </button>
        </div>

        {/* Controls Below Input */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-gray-500">
              Press Enter to submit, Shift+Enter for new line
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <ModelSelector
                value={config.model}
                onChange={(model) => setConfig({ model })}
              />
              <AttachmentUpload
                attachments={config.attachments}
                onAdd={handleAttachment}
                onRemove={removeAttachment}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromptInput

