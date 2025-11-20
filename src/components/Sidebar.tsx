import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { agents, type Agent } from '@/lib/agents'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { Avatar, AvatarFallback } from './ui/avatar'

interface SidebarProps {
  selectedAgent: Agent
  onSelectAgent: (agent: Agent) => void
}

export function Sidebar({ selectedAgent, onSelectAgent }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        'relative flex flex-col border-r bg-muted/30 transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Belfius" className="h-8 w-8" />
            <h2 className="text-lg font-semibold">Belfius</h2>
          </div>
        )}
        {isCollapsed && (
          <img src="/logo.png" alt="Belfius" className="h-8 w-8 mx-auto" />
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "rounded-md p-1.5 hover:bg-primary/10 transition-colors",
            !isCollapsed && "ml-auto"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Agent List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {agents.map((agent) => {
            const isSelected = selectedAgent.id === agent.id

            const agentButton = (
              <button
                key={agent.id}
                onClick={() => onSelectAgent(agent)}
                className={cn(
                  'w-full rounded-lg p-3 text-left transition-colors',
                  'hover:bg-primary/10',
                  isSelected && 'bg-primary/10 border border-primary/20',
                  isCollapsed && 'flex items-center justify-center p-2'
                )}
              >
                <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className={cn('text-lg', agent.color)}>
                      {agent.avatar}
                    </AvatarFallback>
                  </Avatar>

                  {!isCollapsed && (
                    <div className="flex-1 overflow-hidden">
                      <div className="font-medium text-sm truncate">
                        {agent.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {agent.description}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            )

            if (isCollapsed) {
              return (
                <TooltipProvider key={agent.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {agentButton}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{agent.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            }

            return agentButton
          })}
        </div>
      </div>
    </div>
  )
}
