import { useTranslation } from 'react-i18next'


export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="brand text-lg text-white">Nammude Shabdham</span>
          </div>
          <p className="text-sm">{t('app.tagline')}</p>
        </div>
      </div>
    </footer>
  )
}
