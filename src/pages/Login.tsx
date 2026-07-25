import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import type { Role } from '../types'

export default function Login() {
  const { t } = useTranslation()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<Role>('citizen')
  const [submitting, setSubmitting] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (isSignUp) {
        await signUp(email, password, name, role)
        toast.success(t('auth.accountCreated'))
        setIsSignUp(false)
      } else {
        await signIn(email, password)
        navigate('/dashboard')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 bg-gray-100">
      <div className="w-full max-w-md">
        <div className="neo-card p-8">
          <div className="text-center mb-8">
            <img src="/logo-square.jpg" alt={t('app.name')} className="mx-auto h-14 w-14" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              {isSignUp ? t('auth.createAccount') : t('auth.welcomeBack')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isSignUp ? t('auth.signUpDesc') : t('auth.signInDesc')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-800">{t('auth.fullName')}</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full neo-input rounded-xl px-3 py-2 text-sm text-gray-900 outline-none" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-800">{t('auth.email')}</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full neo-input rounded-xl px-3 py-2 text-sm text-gray-900 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">{t('auth.password')}</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full neo-input rounded-xl px-3 py-2 text-sm text-gray-900 outline-none" />
            </div>
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-800">{t('auth.iAmA')}</label>
                <select value={role} onChange={(e) => setRole(e.target.value as Role)}
                  className="mt-1 block w-full neo-input rounded-xl px-3 py-2 text-sm text-gray-900 outline-none">
                  <option value="citizen">{t('auth.citizen')}</option>
                  <option value="officer">{t('auth.officer')}</option>
                </select>
              </div>
            )}
            <button
              type="submit" disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl neo-btn-primary text-white px-4 py-2.5 text-sm font-bold uppercase tracking-wider disabled:opacity-50"
            >
              {submitting ? (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isSignUp ? (
                <><UserPlus className="h-4 w-4" /> {t('auth.createAccountBtn')}</>
              ) : (
                <><LogIn className="h-4 w-4" /> {t('auth.signInBtn')}</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button" onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-bold text-gray-700 hover:text-gray-900 uppercase tracking-wider"
            >
              {isSignUp ? t('auth.alreadyHaveAccount') : t('auth.noAccount')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
