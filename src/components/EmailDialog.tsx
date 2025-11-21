import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail } from 'lucide-react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface EmailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSend: (email: string) => Promise<void>
  isLoading?: boolean
}

export function EmailDialog({ open, onOpenChange, onSend, isLoading }: EmailDialogProps) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSend = async () => {
    if (!email.trim()) {
      setError(t('email.errorRequired'))
      return
    }

    if (!validateEmail(email)) {
      setError(t('email.errorInvalid'))
      return
    }

    setError('')
    await onSend(email)
    setEmail('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            {t('email.title')}
          </DialogTitle>
          <DialogDescription>
            {t('email.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{t('email.emailLabel')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('email.emailPlaceholder')}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleSend()
                }
              }}
              className={error ? 'border-destructive' : ''}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              setEmail('')
              setError('')
            }}
            disabled={isLoading}
          >
            {t('email.cancel')}
          </Button>
          <Button
            type="submit"
            onClick={handleSend}
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-[var(--belfius-hover)]"
          >
            {isLoading ? t('email.sending') : t('email.send')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
