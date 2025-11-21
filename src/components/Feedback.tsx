import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import apiClient from '@/api'

interface FeedbackProps {
  messageId: string
  messageText: string
  sessionId: string
  onFeedback?: (messageId: string, type: 'thumbs-up' | 'thumbs-down') => void
}

export function Feedback({ messageId, messageText, sessionId, onFeedback }: FeedbackProps) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<'up' | 'down' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleThumbsUp = async () => {
    if (isSubmitting) return

    const newValue = selected === 'up' ? null : 'up'
    setSelected(newValue)
    onFeedback?.(messageId, 'thumbs-up')

    if (newValue === 'up') {
      setIsSubmitting(true)
      try {
        await apiClient.provideFeedback({
          session_id: sessionId,
          feedback: 'positive',
          message: messageText,
        })
      } catch (error) {
        console.error('Failed to submit feedback:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleThumbsDown = async () => {
    if (isSubmitting) return

    const newValue = selected === 'down' ? null : 'down'
    setSelected(newValue)
    onFeedback?.(messageId, 'thumbs-down')

    if (newValue === 'down') {
      setIsSubmitting(true)
      try {
        await apiClient.provideFeedback({
          session_id: sessionId,
          feedback: 'negative',
          message: messageText,
        })
      } catch (error) {
        console.error('Failed to submit feedback:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleThumbsUp}
        disabled={isSubmitting}
        className={cn(
          'inline-flex h-7 w-7 items-center justify-center rounded-md',
          'text-muted-foreground hover:bg-muted hover:text-foreground',
          'transition-colors disabled:opacity-50',
          selected === 'up' && 'bg-green-100 text-green-600'
        )}
        title={t('feedback.goodResponse')}
      >
        <ThumbsUp className="h-3.5 w-3.5" />
      </button>

      <button
        onClick={handleThumbsDown}
        disabled={isSubmitting}
        className={cn(
          'inline-flex h-7 w-7 items-center justify-center rounded-md',
          'text-muted-foreground hover:bg-muted hover:text-foreground',
          'transition-colors disabled:opacity-50',
          selected === 'down' && 'bg-red-100 text-red-600'
        )}
        title={t('feedback.badResponse')}
      >
        <ThumbsDown className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
