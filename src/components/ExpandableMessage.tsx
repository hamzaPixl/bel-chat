import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message'

interface ExpandableMessageProps {
  content: string
  longContent?: string
  role: 'user' | 'assistant'
}

export function ExpandableMessage({ content, longContent, role }: ExpandableMessageProps) {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  const hasLongContent = Boolean(longContent)
  const displayContent = isExpanded && longContent ? longContent : content

  return (
    <div className="flex flex-col gap-2">
      <Message from={role}>
        <MessageContent>
          {role === 'assistant' ? (
            <MessageResponse>{displayContent}</MessageResponse>
          ) : (
            <p className="whitespace-pre-wrap text-sm">{displayContent}</p>
          )}
        </MessageContent>
      </Message>

      {hasLongContent && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'inline-flex items-center gap-1.5 self-start',
            'text-xs font-medium text-primary hover:text-primary/80',
            'transition-colors duration-200'
          )}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              {t('chat.showLess')}
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              {t('chat.showMore')}
            </>
          )}
        </button>
      )}
    </div>
  )
}
