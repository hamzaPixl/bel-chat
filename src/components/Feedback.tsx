import { useState } from 'react'
import { ThumbsUp, ThumbsDown, MessageSquare, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

interface FeedbackProps {
  messageId: string
  onFeedback?: (messageId: string, type: 'thumbs-up' | 'thumbs-down' | 'message', comment?: string) => void
}

export function Feedback({ messageId, onFeedback }: FeedbackProps) {
  const [selected, setSelected] = useState<'up' | 'down' | null>(null)
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [comment, setComment] = useState('')

  const handleThumbsUp = () => {
    setSelected(selected === 'up' ? null : 'up')
    onFeedback?.(messageId, 'thumbs-up')
  }

  const handleThumbsDown = () => {
    setSelected(selected === 'down' ? null : 'down')
    onFeedback?.(messageId, 'thumbs-down')
  }

  const handleComment = () => {
    setShowCommentBox(!showCommentBox)
  }

  const handleSubmitComment = () => {
    if (comment.trim()) {
      onFeedback?.(messageId, 'message', comment)
      setComment('')
      setShowCommentBox(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <button
          onClick={handleThumbsUp}
          className={cn(
            'inline-flex h-7 w-7 items-center justify-center rounded-md',
            'text-muted-foreground hover:bg-muted hover:text-foreground',
            'transition-colors',
            selected === 'up' && 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
          )}
          title="Good response"
        >
          <ThumbsUp className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={handleThumbsDown}
          className={cn(
            'inline-flex h-7 w-7 items-center justify-center rounded-md',
            'text-muted-foreground hover:bg-muted hover:text-foreground',
            'transition-colors',
            selected === 'down' && 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
          )}
          title="Bad response"
        >
          <ThumbsDown className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={handleComment}
          className={cn(
            'inline-flex h-7 w-7 items-center justify-center rounded-md',
            'text-muted-foreground hover:bg-muted hover:text-foreground',
            'transition-colors',
            showCommentBox && 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
          )}
          title="Add comment"
        >
          <MessageSquare className="h-3.5 w-3.5" />
        </button>
      </div>

      {showCommentBox && (
        <div className="rounded-lg border bg-background p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium">Add feedback</span>
            <button
              onClick={() => setShowCommentBox(false)}
              className="rounded-sm opacity-70 hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What could be improved?"
            className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            rows={3}
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowCommentBox(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitComment}
              disabled={!comment.trim()}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
