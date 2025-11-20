import { useState, useCallback } from 'react'
import { nanoid } from 'nanoid'

export type MessagePart = {
  type: 'text'
  text: string
}

export type UIMessage = {
  id: string
  role: 'user' | 'assistant'
  parts: MessagePart[]
  createdAt: Date
}

export type ChatStatus = 'ready' | 'streaming' | 'error'

export function useMockChat() {
  const [messages, setMessages] = useState<UIMessage[]>([])
  const [status, setStatus] = useState<ChatStatus>('ready')

  const mockResponses = [
    "Hello! I'm a mock AI assistant. How can I help you today?",
    "That's an interesting question! Let me think about that...",
    "I understand what you're asking. Here's what I think:",
    "Great question! I'd be happy to help with that.",
    "Based on what you've told me, I would suggest:",
  ]

  const sendMessage = useCallback(async ({ text }: { text: string }) => {
    // Add user message
    const userMessage: UIMessage = {
      id: nanoid(),
      role: 'user',
      parts: [{ type: 'text', text }],
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setStatus('streaming')

    // Simulate streaming response
    const assistantMessageId = nanoid()
    const responseText = mockResponses[Math.floor(Math.random() * mockResponses.length)]

    // Add empty assistant message
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: 'assistant',
        parts: [{ type: 'text', text: '' }],
        createdAt: new Date(),
      },
    ])

    // Simulate streaming by adding text chunk by chunk
    const words = responseText.split(' ')
    for (let i = 0; i < words.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50))

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                parts: [
                  {
                    type: 'text',
                    text: words.slice(0, i + 1).join(' ') + (i < words.length - 1 ? '' : ''),
                  },
                ],
              }
            : msg
        )
      )
    }

    setStatus('ready')
  }, [])

  const stop = useCallback(() => {
    setStatus('ready')
  }, [])

  return {
    messages,
    status,
    sendMessage,
    stop,
  }
}
