import apiClient, { type Agent as ApiAgent } from '@/api'

export interface Agent {
  id: string
  name: string
  avatar: string
  description: string
  color: string
}

// Default avatar and color mapping for agents
const agentVisuals: Record<string, { avatar: string; color: string }> = {
  general: { avatar: '🤖', color: 'bg-blue-500' },
  coding: { avatar: '💻', color: 'bg-purple-500' },
  writing: { avatar: '✍️', color: 'bg-green-500' },
  data: { avatar: '📊', color: 'bg-orange-500' },
  research: { avatar: '🔍', color: 'bg-teal-500' },
  default: { avatar: '💬', color: 'bg-gray-500' },
}

// Transform API agent to UI agent with visuals
function transformAgent(apiAgent: ApiAgent): Agent {
  const visuals = agentVisuals[apiAgent.id] || agentVisuals.default
  return {
    ...apiAgent,
    avatar: visuals.avatar,
    color: visuals.color,
  }
}

// Fetch agents from API
export async function fetchAgents(): Promise<Agent[]> {
  try {
    const response = await apiClient.getAgentInfo()
    return response.agents.map(transformAgent)
  } catch (error) {
    console.error('Failed to fetch agents:', error)
    // Return default agent as fallback
    return [
      {
        id: 'general',
        name: 'General Assistant',
        avatar: '🤖',
        description: 'General purpose AI assistant for various tasks',
        color: 'bg-blue-500',
      },
    ]
  }
}

// Export a singleton for loaded agents
export let agents: Agent[] = []

// Initialize agents
export async function initializeAgents(): Promise<void> {
  agents = await fetchAgents()
}
