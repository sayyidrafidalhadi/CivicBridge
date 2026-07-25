import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Send, FileText, MapPin, Camera } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'
import MapPicker from '../components/MapPicker'
import LoadingSpinner from '../components/LoadingSpinner'
import { createComplaint, uploadImage } from '../services/complaints'
import { getAuthorities } from '../services/authorities'
import type { Authority } from '../types'

const CATEGORIES = [
  'roads', 'water', 'electricity', 'waste', 'parks', 'safety', 'noise', 'other',
]

export default function Report() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [loadingAuthorities, setLoadingAuthorities] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [authorities, setAuthorities] = useState<Authority[]>([])
  const [selectedAuthority, setSelectedAuthority] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)

  useEffect(() => { loadAuthorities() }, [])

  const loadAuthorities = async () => {
    try {
      const data = await getAuthorities()
      setAuthorities(data)
      if (data.length > 0) setSelectedAuthority(data[0].id)
    } catch { toast.error(t('report.loadError')) }
    finally { setLoadingAuthorities(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAuthority) { toast.error(t('report.selectAuthority')); return }
    setSubmitting(true)
    try {
      let image_url: string | null = null
      if (imageFile) image_url = await uploadImage(imageFile)
      await createComplaint({ title, description, category, image_url, latitude, longitude, assigned_to: selectedAuthority })
      toast.success(t('report.success'))
      navigate('/complaints')
    } catch (err) { toast.error(err instanceof Error ? err.message : t('report.submitError')) }
    finally { setSubmitting(false) }
  }

  if (loadingAuthorities) return <LoadingSpinner size="lg" />

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="neo-card p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-black text-white">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">{t('report.title')}</h1>
            <p className="text-xs font-medium text-gray-500 mt-1">{t('report.subtitle')}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">{t('report.titleLabel')}</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder={t('report.titlePlaceholder')}
              className="mt-1 block w-full neo-input rounded-xl px-3 py-2.5 text-sm font-medium text-gray-900 outline-none" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">{t('report.category')}</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full neo-input rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none">
                {CATEGORIES.map((c) => <option key={c} value={c}>{t(`categories.${c}`)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">{t('report.assignTo')}</label>
              <select required value={selectedAuthority} onChange={(e) => setSelectedAuthority(e.target.value)}
                className="mt-1 block w-full neo-input rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none">
                {authorities.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">{t('report.description')}</label>
            <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder={t('report.descriptionPlaceholder')}
              className="mt-1 block w-full neo-input rounded-xl px-3 py-2.5 text-sm font-medium text-gray-900 outline-none" />
          </div>

          <div className="neo-card-sm p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              <Camera className="w-4 h-4" />
              <span>{t('report.photoEvidence')}</span>
            </div>
            <ImageUpload onImageSelect={setImageFile} />
          </div>

          <div className="neo-card-sm p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4" />
              <span>{t('report.location')}</span>
            </div>
            <MapPicker onLocationSelect={(lat, lng) => { setLatitude(lat); setLongitude(lng) }} />
          </div>

          <button
            type="submit" disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl neo-btn-primary text-white px-4 py-3 text-sm font-bold uppercase tracking-wider disabled:opacity-50"
          >
            {submitting ? <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send className="h-4 w-4" /> {t('report.submit')}</>}
          </button>
        </div>
      </form>
    </div>
  )
}
