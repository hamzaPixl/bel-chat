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
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
]

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const selectedLanguage = languages.find((lang) => lang.code === value)

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
              {lang.flag} {lang.name}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
