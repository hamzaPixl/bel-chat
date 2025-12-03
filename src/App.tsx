import { useState, useEffect } from 'react'
import './i18n/config'
import { Chat } from './components/Chat'
import { HomePage } from './components/HomePage'
import { MaintenancePage } from './components/MaintenancePage'
import { type Agent } from '@/lib/agents'
import apiClient from '@/api'

function App() {
  const [currentView, setCurrentView] = useState<'loading' | 'maintenance' | 'home' | 'chat'>('loading')
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  // Check health on mount
  useEffect(() => {
    async function checkHealth() {
      try {
        const health = await apiClient.getHealth()
        if (health.available === false) {
          setCurrentView('maintenance')
        } else {
          setCurrentView('home')
        }
      } catch (error) {
        console.error('Health check failed:', error)
        setCurrentView('maintenance')
      }
    }
    checkHealth()
  }, [])

  const handleStartChat = (agent: Agent) => {
    setSelectedAgent(agent)
    setCurrentView('chat')
  }

  const handleBackToHome = () => {
    setCurrentView('home')
    setSelectedAgent(null)
  }

  if (currentView === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Belfius" className="h-10 w-auto animate-pulse" />
        </div>
      </div>
    )
  }

  if (currentView === 'maintenance') {
    return <MaintenancePage />
  }

  if (currentView === 'home') {
    return <HomePage onStartChat={handleStartChat} />
  }

  return <Chat initialAgent={selectedAgent} onBackToHome={handleBackToHome} />
}

export default App
