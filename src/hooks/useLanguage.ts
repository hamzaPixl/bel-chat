import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export type Language = 'en' | 'fr' | 'nl';

export function useLanguage() {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language as Language;

  const changeLanguage = useCallback((lng: Language) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  }, [i18n]);

  return {
    language: currentLanguage,
    changeLanguage,
  };
}
