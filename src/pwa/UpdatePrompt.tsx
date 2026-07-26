import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshCw, X, Download } from 'lucide-react'
import { useRegisterSW } from 'virtual:pwa-register/react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function UpdatePrompt() {
  const { t } = useTranslation()
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  const {
    offlineReady: [offlineReady],
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      r && setInterval(() => {
        r.update()
      }, 60 * 60 * 1000)
    },
  })

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!installPrompt && !needRefresh && !offlineReady) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 fade-in duration-300">
      <div className="neo-card rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-3">
          {needRefresh && (
            <>
              <RefreshCw className="h-5 w-5 text-emerald-600" />
              <span className="text-sm text-gray-700">
                {t('pwa.updateAvailable', 'Update available')}
              </span>
              <button
                onClick={() => updateServiceWorker(true)}
                className="neo-btn-primary rounded-xl px-4 py-2 text-sm font-semibold"
              >
                {t('pwa.update', 'Update')}
              </button>
            </>
          )}
          {offlineReady && !needRefresh && (
            <span className="text-sm text-gray-500">
              {t('pwa.offlineReady', 'Ready to use offline')}
            </span>
          )}
          {installPrompt && !needRefresh && !offlineReady && (
            <>
              <Download className="h-5 w-5 text-emerald-600" />
              <span className="text-sm text-gray-700">
                {t('pwa.installPrompt', 'Install the app for offline access')}
              </span>
              <button
                onClick={() => {
                  installPrompt.prompt()
                  installPrompt.userChoice.then(() => setInstallPrompt(null))
                }}
                className="neo-btn-primary rounded-xl px-4 py-2 text-sm font-semibold"
              >
                {t('pwa.install', 'Install')}
              </button>
              <button
                onClick={() => setInstallPrompt(null)}
                className="rounded-xl p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
