export interface Agent {
  id: string
  name: string
  avatar: string
  description: string
  color: string
}

export const agents: Agent[] = [
  {
    id: 'general',
    name: 'General Assistant',
    avatar: '🤖',
    description: 'General purpose AI assistant for various tasks',
    color: 'bg-blue-500',
  },
  {
    id: 'coding',
    name: 'Code Helper',
    avatar: '💻',
    description: 'Specialized in coding and programming tasks',
    color: 'bg-purple-500',
  },
  {
    id: 'writing',
    name: 'Writing Assistant',
    avatar: '✍️',
    description: 'Help with writing, editing, and content creation',
    color: 'bg-green-500',
  },
  {
    id: 'data',
    name: 'Data Analyst',
    avatar: '📊',
    description: 'Data analysis and visualization expert',
    color: 'bg-orange-500',
  },
  {
    id: 'research',
    name: 'Research Assistant',
    avatar: '🔍',
    description: 'Research and information gathering specialist',
    color: 'bg-teal-500',
  },
]
