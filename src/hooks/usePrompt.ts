import { useState, useRef } from 'react'

export interface PromptConfig {
  model: string
  temperature: number
  maxTokens: number
  attachments: File[]
}

export interface UsePromptReturn {
  input: string
  setInput: (value: string) => void
  isLoading: boolean
  config: PromptConfig
  setConfig: (config: Partial<PromptConfig>) => void
  inputRef: React.RefObject<HTMLTextAreaElement>
  handleSend: () => Promise<void>
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  handleAttachment: (files: FileList | null) => void
  removeAttachment: (index: number) => void
}

const defaultConfig: PromptConfig = {
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 2000,
  attachments: []
}

export const usePrompt = (onSubmit?: (prompt: string, config: PromptConfig) => Promise<void>): UsePromptReturn => {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [config, setConfigState] = useState<PromptConfig>(defaultConfig)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const setConfig = (newConfig: Partial<PromptConfig>) => {
    setConfigState(prev => ({ ...prev, ...newConfig }))
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const prompt = input.trim()
    const currentConfig = config
    setInput('')
    setIsLoading(true)

    try {
      if (onSubmit) {
        await onSubmit(prompt, currentConfig)
      } else {
        // Default behavior
        console.log('Prompt:', prompt)
        console.log('Config:', currentConfig)
      }
    } catch (error) {
      console.error('Error submitting prompt:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleAttachment = (files: FileList | null) => {
    if (!files) return
    const newFiles = Array.from(files)
    setConfig({ attachments: [...config.attachments, ...newFiles] })
  }

  const removeAttachment = (index: number) => {
    const newAttachments = config.attachments.filter((_, i) => i !== index)
    setConfig({ attachments: newAttachments })
  }

  return {
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
  }
}

