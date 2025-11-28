import type { PromptConfig } from '../types'

export interface ApiResponse {
  content: string
  error?: string
}

export class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export const sendPrompt = async (
  prompt: string,
  config: PromptConfig,
  onStream?: (chunk: string) => void
): Promise<string> => {
  // Replace this with your actual API endpoint
  const API_URL = import.meta.env.VITE_API_URL || 'https://api.example.com/chat'

  try {
    const formData = new FormData()
    formData.append('prompt', prompt)
    formData.append('model', config.model)
    formData.append('temperature', config.temperature.toString())
    formData.append('max_tokens', config.maxTokens.toString())

    // Add attachments if any
    config.attachments.forEach((file, index) => {
      formData.append(`attachment_${index}`, file)
    })

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type header, let browser set it with boundary for FormData
        'Authorization': `Bearer ${import.meta.env.VITE_API_KEY || ''}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new ApiError(errorData.error || `HTTP ${response.status}`, response.status)
    }

    // Handle streaming response if supported
    if (onStream && response.body) {
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(line => line.trim())

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              const content = parsed.content || parsed.text || ''
              fullResponse += content
              onStream(content)
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      return fullResponse
    }

    // Handle regular JSON response
    const data = await response.json()
    return data.content || data.text || data.response || 'No response received'
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Failed to send prompt',
      500
    )
  }
}

// Mock API for development
export const sendPromptMock = async (
  prompt: string,
  config: PromptConfig,
  onStream?: (chunk: string) => void
): Promise<string> => {
  return new Promise((resolve) => {
    const mockResponse = `This is a mock response to: "${prompt.substring(0, 50)}..."\n\nUsing model: ${config.model}\nTemperature: ${config.temperature}\nMax tokens: ${config.maxTokens}`
    
    if (onStream) {
      let index = 0
      const interval = setInterval(() => {
        if (index < mockResponse.length) {
          const chunk = mockResponse.substring(index, index + 5)
          onStream(chunk)
          index += 5
        } else {
          clearInterval(interval)
          resolve(mockResponse)
        }
      }, 50)
    } else {
      setTimeout(() => resolve(mockResponse), 1000)
    }
  })
}

