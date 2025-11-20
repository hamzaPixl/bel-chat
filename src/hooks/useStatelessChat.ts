import { useState, useCallback } from 'react'
import { nanoid } from 'nanoid'
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

export function useStatelessChat() {
  const [messages, setMessages] = useState<UIMessage[]>([])
  const [status, setStatus] = useState<ChatStatus>('awaiting_message')

  const mockResponses = [
    `# Hello! Welcome to Belfius Chat

I'm here to help you with your questions. Here are some things I can assist with:

- **Account Information** - Check balances and transactions
- **Payments** - Set up transfers and payments
- **Investments** - Get advice on investment options
- **Support** - General banking assistance

What would you like to know?`,

    `## Great Question!

Let me provide you with a detailed answer:

### Key Points:
1. First, you should understand the basics
2. Then, consider the following options
3. Finally, make an informed decision

> **Note:** This is important information to remember.

Here's a code example if needed:
\`\`\`javascript
const example = "formatted code";
console.log(example);
\`\`\`

Does this help answer your question?`,

    `I understand what you're asking. Here's my response:

- ✅ Option A: This is recommended
- ⚠️ Option B: Use with caution
- ❌ Option C: Not recommended

**Bold text** and *italic text* are both supported!

[Learn more](https://example.com)`,

    `Based on what you've told me, I would suggest the following approach:

| Feature | Description | Status |
|---------|-------------|--------|
| Feature 1 | Basic support | ✅ Active |
| Feature 2 | Advanced tools | 🚧 In Progress |
| Feature 3 | Premium service | 📅 Coming Soon |

Let me know if you need more details!`,

    `Great question! Here's what I think:

### Overview
This is a **comprehensive answer** with various markdown elements.

#### Code Block
\`\`\`python
def hello_world():
    print("Hello from Belfius!")
    return True
\`\`\`

#### Lists
**Ordered:**
1. First item
2. Second item
3. Third item

**Unordered:**
- Point one
- Point two
  - Nested point
  - Another nested point

> 💡 **Pro Tip:** You can use markdown to format your responses beautifully!

---

Hope this helps! 🎉`,
  ]

  const sendMessage = useCallback(async ({ text, agent }: { text: string; agent: Agent }) => {
    // Add user message
    const userMessage: UIMessage = {
      id: nanoid(),
      role: 'user',
      parts: [{ type: 'text', text }],
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setStatus('streaming')

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Generate instant response (no streaming)
    const responseText = `[${agent.name}] ${mockResponses[Math.floor(Math.random() * mockResponses.length)]}`

    const assistantMessage: UIMessage = {
      id: nanoid(),
      role: 'assistant',
      parts: [{ type: 'text', text: responseText }],
      createdAt: new Date(),
      agentId: agent.id,
    }

    setMessages((prev) => [...prev, assistantMessage])
    setStatus('awaiting_message')
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    status,
    sendMessage,
    clearMessages,
  }
}
