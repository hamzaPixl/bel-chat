import { useTranslation } from 'react-i18next'
import { FileText, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Ressource } from '@/api'

interface ResourceListProps {
  resources: Ressource[]
  onResourceClick?: (resource: Ressource) => void
  className?: string
}

export function ResourceList({ resources, onResourceClick, className }: ResourceListProps) {
  const { t } = useTranslation()

  if (!resources || resources.length === 0) {
    return null
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <span className="text-xs font-medium text-muted-foreground">
        {t('chat.resources')}
      </span>
      <div className="flex flex-wrap gap-2">
        {resources.map((resource, index) => (
          <button
            key={index}
            onClick={() => onResourceClick?.(resource)}
            className={cn(
              'inline-flex items-center gap-2 px-3 py-2 rounded-lg',
              'bg-muted/50 hover:bg-muted',
              'text-sm text-foreground',
              'border border-border hover:border-primary/30',
              'transition-colors duration-200',
              'text-left'
            )}
          >
            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="truncate max-w-[200px]">{resource.title}</span>
            {resource.page_number && (
              <span className="text-xs text-muted-foreground shrink-0">
                p.{resource.page_number}
              </span>
            )}
            <Eye className="h-3 w-3 text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>
    </div>
  )
}
