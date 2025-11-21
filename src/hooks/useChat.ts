import { useState, useCallback, useRef } from 'react'
import { nanoid } from 'nanoid'
import apiClient, { type Message as ApiMessage, type ChatRequest } from '@/api'
import type { Agent } from '@/lib/agents'

export type MessagePart = {
  type: 'text'
  text: string
}

export type UIMessage = {
  id: string
  role: 'user' | 'assistant'
  parts: MessagePart[]
  createdAt: Date
  agentId?: string
}

export type ChatStatus = 'awaiting_message' | 'submitted' | 'streaming' | 'error'

export function useChat() {
  const [messages, setMessages] = useState<UIMessage[]>([])
  const [status, setStatus] = useState<ChatStatus>('awaiting_message')
  const [sessionId, setSessionId] = useState<string>(nanoid())
  const [language, setLanguage] = useState<string>('en')

  // Keep history in API format for subsequent requests
  const historyRef = useRef<ApiMessage[]>([])

  const sendMessage = useCallback(async ({ text, agent }: { text: string; agent: Agent }) => {
    // Add user message immediately
    const userMessage: UIMessage = {
      id: nanoid(),
      role: 'user',
      parts: [{ type: 'text', text }],
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setStatus('streaming')

    // Add to history
    const userApiMessage: ApiMessage = {
      content: text,
      sender: 'user',
    }
    historyRef.current.push(userApiMessage)

    try {
      // Prepare request
      const chatRequest: ChatRequest = {
        history: historyRef.current,
        user_input: userApiMessage,
        session_id: sessionId,
        agent: agent.id,
        language: language,
      }

      // Call API
      const response = await apiClient.sendChatMessage(chatRequest)

      if (response.success && response.history.length > 0) {
        // Get the last assistant message from the history
        const lastMessage = response.history[response.history.length - 1]

        if (lastMessage.sender === 'assistant') {
          const assistantMessage: UIMessage = {
            id: nanoid(),
            role: 'assistant',
            parts: [{ type: 'text', text: lastMessage.content }],
            createdAt: new Date(),
            agentId: agent.id,
          }

          setMessages((prev) => [...prev, assistantMessage])

          // Update history with full response
          historyRef.current = response.history
        }
      }

      setStatus('awaiting_message')
    } catch (error) {
      console.error('Failed to send message:', error)
      setStatus('error')

      // Add error message
      const errorMessage: UIMessage = {
        id: nanoid(),
        role: 'assistant',
        parts: [{ type: 'text', text: 'Sorry, I encountered an error. Please try again.' }],
        createdAt: new Date(),
        agentId: agent.id,
      }
      setMessages((prev) => [...prev, errorMessage])

      setTimeout(() => setStatus('awaiting_message'), 2000)
    }
  }, [sessionId, language])

  const clearMessages = useCallback(() => {
    setMessages([])
    historyRef.current = []
    setSessionId(nanoid()) // Generate new session ID for new conversation
    setStatus('awaiting_message')
  }, [])

  const changeLanguage = useCallback((newLanguage: string) => {
    setLanguage(newLanguage)
  }, [])

  return {
    messages,
    status,
    sessionId,
    language,
    sendMessage,
    clearMessages,
    changeLanguage,
  }
}
