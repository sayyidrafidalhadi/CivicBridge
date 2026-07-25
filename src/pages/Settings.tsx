import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { User, Save, Mail, Shield, Settings as SettingsIcon } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getSupabase } from '../lib/supabase'

export default function Settings() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !user) return
    setSaving(true)
    try {
      const supabase = getSupabase()
      const { error } = await supabase.from('profiles').update({ name: name.trim() }).eq('id', user.id)
      if (error) throw error
      toast.success(t('settings.saved'))
    } catch {
      toast.error(t('settings.saveError'))
    } finally { setSaving(false) }
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(user?.id || '')
    toast.success(t('settings.idCopied'))
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="neo-card p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-black text-white">
            <SettingsIcon className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">{t('settings.title')}</h1>
            <p className="text-xs font-medium text-gray-500 mt-1">{t('settings.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="neo-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
            <User className="h-6 w-6 text-gray-900" />
          </div>
          <div>
            <p className="font-bold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
              <Mail className="h-3.5 w-3.5 inline mr-1" /> {t('auth.email')}
            </label>
            <input type="email" value={user?.email || ''} disabled
              className="block w-full neo-input rounded-xl px-3 py-2 text-sm text-gray-500 cursor-not-allowed opacity-60" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
              <User className="h-3.5 w-3.5 inline mr-1" /> {t('auth.fullName')}
            </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full neo-input rounded-xl px-3 py-2 text-sm font-medium text-gray-900 outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
              <Shield className="h-3.5 w-3.5 inline mr-1" /> {t('settings.userId')}
            </label>
            <div className="flex gap-2">
              <input type="text" value={user?.id || ''} readOnly
                className="flex-1 neo-input rounded-xl px-3 py-2 text-xs font-mono text-gray-500 opacity-60" />
              <button type="button" onClick={handleCopyId}
                className="rounded-xl neo-card-sm px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                {t('settings.copy')}
              </button>
            </div>
          </div>

          <button type="submit" disabled={saving || !name.trim() || name === user?.name}
            className="flex w-full items-center justify-center gap-2 rounded-xl neo-btn-primary text-white px-4 py-2.5 text-sm font-bold uppercase tracking-wider disabled:opacity-50">
            {saving ? <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save className="h-4 w-4" /> {t('settings.save')}</>}
          </button>
        </form>
      </div>
    </div>
  )
}
