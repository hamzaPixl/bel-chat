import { useState } from 'react'
import './i18n/config'
import { Chat } from './components/Chat'
import { HomePage } from './components/HomePage'
import { type Agent } from '@/lib/agents'

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'chat'>('home')
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  const handleStartChat = (agent: Agent) => {
    setSelectedAgent(agent)
    setCurrentView('chat')
  }

  const handleBackToHome = () => {
    setCurrentView('home')
    setSelectedAgent(null)
  }

  if (currentView === 'home') {
    return <HomePage onStartChat={handleStartChat} />
  }

  return <Chat initialAgent={selectedAgent} onBackToHome={handleBackToHome} />
}

export default App
