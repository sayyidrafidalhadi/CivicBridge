import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggleLang = () => {
    const newLang = i18n.language === 'en' ? 'ml' : 'en'
    i18n.changeLanguage(newLang)
    localStorage.setItem('lang', newLang)
  }

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-200 transition"
      title={i18n.language === 'en' ? 'മലയാളത്തിലേക്ക് മാറുക' : 'Switch to English'}
    >
      <Languages className="h-4 w-4" />
      <span className="hidden sm:inline">{i18n.language === 'en' ? 'മലയാളം' : 'English'}</span>
    </button>
  )
}
