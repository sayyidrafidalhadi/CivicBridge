import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Landmark, Home } from 'lucide-react'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-black shadow-lg">
          <Landmark className="h-8 w-8 text-white" />
        </div>
        <h1 className="mt-6 text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-xl text-gray-600">{t('error.notFound')}</p>
        <p className="mt-2 text-gray-500">{t('error.notFoundDesc')}</p>
        <Link to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl neo-btn-primary text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider">
          <Home className="h-4 w-4" /> {t('error.goHome')}
        </Link>
      </div>
    </div>
  )
}
