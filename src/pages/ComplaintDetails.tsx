import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import { ArrowLeft, Calendar, Building2, User, Share2, MapPin, Clock } from 'lucide-react'
import type { Complaint } from '../types'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import ImageWithLightbox from '../components/ImageLightbox'
import CommentsSection from '../components/CommentsSection'
import { getComplaint } from '../services/complaints'
import { formatDate } from '../utils'

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41],
})

export default function ComplaintDetails() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (id) loadComplaint(id) }, [id])

  const loadComplaint = async (complaintId: string) => {
    try { setComplaint(await getComplaint(complaintId)) }
    catch { console.error('Failed to load complaint') }
    finally { setLoading(false) }
  }

  if (loading) return <LoadingSpinner size="lg" />
  if (!complaint) return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-gray-900">{t('detail.notFound')}</h2>
      <Link to="/complaints" className="mt-4 inline-flex items-center gap-1 text-gray-900 hover:text-gray-600 font-bold uppercase text-xs tracking-wider">
        <ArrowLeft className="h-4 w-4" /> {t('detail.back')}
      </Link>
    </div>
  )

  const steps = [
    { key: 'submitted', label: t('detail.submitted'), time: complaint.created_at },
    { key: 'under_review', label: t('detail.underReview'), time: ['under_review', 'in_progress', 'resolved'].includes(complaint.status) ? complaint.updated_at : null },
    { key: 'in_progress', label: t('detail.inProgress'), time: ['in_progress', 'resolved'].includes(complaint.status) ? complaint.updated_at : null },
    { key: 'resolved', label: t('status.resolved'), time: complaint.status === 'resolved' ? complaint.updated_at : null },
  ]
  const currentIndex = steps.findIndex((s) => s.key === complaint.status)

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link to="/complaints" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gray-900 hover:text-gray-600">
        <ArrowLeft className="h-4 w-4" /> {t('detail.back')}
      </Link>

      <div className="neo-card p-6 sm:p-8 mt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-3 py-1 bg-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900">#{complaint.case_number}</span>
              <span className="px-2.5 py-1 bg-gray-200 rounded-full text-[10px] font-bold uppercase text-gray-900">{t(`categories.${complaint.category}`)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">{complaint.title}</h1>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />{t(`categories.${complaint.category}`)}</span>
          <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{complaint.profiles?.name || t('complaints.anonymous')}</span>
          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{formatDate(complaint.created_at)}</span>
          {complaint.authorities && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-200 rounded-full font-bold uppercase text-gray-900">
              <Building2 className="h-3 w-3" />
              {complaint.authorities.name}
            </span>
          )}
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success(t('complaints.linkCopied')) }}
            className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 transition ml-auto">
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-5 space-y-5">
          {complaint.image_url && (
            <div className="neo-card-sm rounded-2xl overflow-hidden">
              <ImageWithLightbox src={complaint.image_url} alt={complaint.title} className="w-full" />
            </div>
          )}

            <div className="neo-card-sm p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 text-xs">
              <span className="text-gray-500 font-bold uppercase tracking-wider">{t('detail.reportedByLabel')}</span>
              <span className="font-bold text-gray-900">{complaint.profiles?.name || t('complaints.anonymous')}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 text-xs">
              <span className="text-gray-500 font-bold uppercase tracking-wider">{t('detail.categoryLabel')}</span>
              <span className="font-bold text-gray-900">{t(`categories.${complaint.category}`)}</span>
            </div>
            {complaint.latitude && complaint.longitude && (
              <div className="flex items-start gap-2 pt-1 text-xs">
                <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <p className="font-bold text-gray-900">{complaint.latitude.toFixed(4)}, {complaint.longitude.toFixed(4)}</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="neo-card-sm p-5">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('detail.description')}</h2>
            <p className="text-sm text-gray-800 leading-relaxed">{complaint.description}</p>
          </div>

          {complaint.resolution_notes && (
            <div className="neo-card-sm p-5 bg-gray-200">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{t('detail.resolutionSummary')}</h4>
              <p className="text-xs text-gray-700 leading-relaxed font-medium mt-1">&ldquo;{complaint.resolution_notes}&rdquo;</p>
            </div>
          )}

          {complaint.latitude && complaint.longitude && (
            <div>
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">{t('detail.location')}</h2>
              <div className="h-64 rounded-2xl overflow-hidden border border-gray-200 neo-card-sm">
                <MapContainer center={[complaint.latitude, complaint.longitude]} zoom={15} className="h-full w-full" zoomControl={true} scrollWheelZoom={false}>
                  <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[complaint.latitude, complaint.longitude]} icon={icon} />
                </MapContainer>
              </div>
            </div>
          )}

          <div className="neo-card-sm p-5">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {t('detail.statusHistory')}
            </h2>
            <div className="space-y-4">
              {steps.map((step, i) => {
                const isActive = i <= currentIndex
                return (
                  <div key={step.key} className="flex gap-3">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shrink-0 ${isActive ? 'bg-gray-900' : 'bg-gray-300'}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0 pb-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</span>
                        {step.time && <span className="text-xs text-gray-500">{formatDate(step.time)}</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="neo-card-sm p-5">
            <CommentsSection complaintId={id!} />
          </div>
        </div>
      </div>
    </div>
  )
}
