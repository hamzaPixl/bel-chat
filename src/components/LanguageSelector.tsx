import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

interface LanguageSelectorProps {
  value: string
  onChange: (value: string) => void
}

const languages = [
  { code: 'en', flag: '🇬🇧' },
  { code: 'nl', flag: '🇳🇱' },
  { code: 'fr', flag: '🇫🇷' },
]

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const { t } = useTranslation()
  const selectedLanguage = languages.find((lang) => lang.code === value)

  const getLanguageName = (code: string) => {
    switch (code) {
      case 'en':
        return t('language.english')
      case 'fr':
        return t('language.french')
      case 'nl':
        return t('language.dutch')
      default:
        return code
    }
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[140px] h-9 bg-background border-input">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <SelectValue>
            <span className="text-sm">
              {selectedLanguage?.flag} {selectedLanguage?.code.toUpperCase()}
            </span>
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="text-sm">
              {lang.flag} {getLanguageName(lang.code)}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
