# Simple AI Chat

A minimal, clean AI chatbot built with React, Vite, and shadcn/ui design patterns. Features a GPT-like chat interface with mock AI responses.

## Features

- **Simple React App** - Built with Vite for fast development
- **GPT-like UI** - Clean, modern chat interface inspired by ChatGPT
- **shadcn/ui Design** - Professional UI components with Tailwind CSS
- **Mock AI Responses** - No API keys needed, perfect for prototyping
- **Markdown Support** - Rich text rendering with react-markdown
- **No Authentication** - Simplified version without auth complexity
- **No Backend** - Purely client-side, no server required
- **No Database** - In-memory chat (resets on refresh)
- **Whitelabel Ready** - Easy to customize and brand

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai-chatbot
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Chat.tsx          # Main chat component
│   │   ├── Message.tsx       # Message display component
│   │   └── ui/               # shadcn/ui components
│   │       ├── avatar.tsx    # Avatar component
│   │       └── button.tsx    # Button component
│   ├── hooks/
│   │   └── useMockChat.ts    # Mock chat hook
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   ├── App.tsx               # Root component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles with CSS variables
├── .env.example              # Environment template (empty for now)
└── package.json              # Dependencies and scripts
```

## Customization

### Connect to Real AI API

Replace the `useMockChat` hook in `Chat.tsx` with `useChat` from `@ai-sdk/react`:

```tsx
// Instead of:
import { useMockChat } from '@/hooks/useMockChat'
const { messages, status, sendMessage, stop } = useMockChat()

// Use:
import { useChat } from '@ai-sdk/react'
const { messages, status, sendMessage, stop } = useChat({
  api: '/api/chat',
})
```

Then create an API route that integrates with your AI provider. See the [AI SDK documentation](https://ai-sdk.dev/docs/introduction) for more details.

### Styling & Branding

The app uses CSS variables for theming. Edit `src/index.css` to customize:

- Colors (primary, secondary, accent, etc.)
- Border radius
- Spacing
- Typography

All components use these variables, making it easy to apply your brand colors.

### Add More UI Components

The project uses shadcn/ui patterns. You can add more components from [shadcn/ui](https://ui.shadcn.com) or create your own following the same pattern.

## Technologies

- **React 18** - UI framework
- **Vite 6** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **@ai-sdk/react** - Chat state management (ready to use)
- **react-markdown** - Markdown rendering
- **Lucide React** - Icons
- **shadcn/ui patterns** - UI components

## License

MIT
