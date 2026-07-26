import { WifiOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Offline() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
          <WifiOff className="h-10 w-10 text-amber-600" />
        </div>
        <h1 className="mb-3 text-2xl font-bold text-gray-800">
          {t('offline.title', 'You\'re Offline')}
        </h1>
        <p className="mb-6 text-gray-600">
          {t('offline.description', 'Check your internet connection and try again. Some features may be limited while offline.')}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="neo-btn-primary rounded-xl px-6 py-3 text-sm font-semibold"
        >
          {t('offline.retry', 'Retry')}
        </button>
      </div>
    </div>
  )
}
