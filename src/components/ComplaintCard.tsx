import { Link } from 'react-router-dom'
import { ChevronRight, MapPin, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Complaint } from '../types'
import StatusBadge from './StatusBadge'
import { formatDate } from '../utils'

interface ComplaintCardProps {
  complaint: Complaint & { profiles?: { name: string } | null; authorities?: { name: string; type: string } | null }
}

export default function ComplaintCard({ complaint }: ComplaintCardProps) {
  const { t } = useTranslation()
  return (
    <Link to={`/complaints/${complaint.id}`} className="group block">
      <article className="neo-card p-5 flex flex-col sm:flex-row gap-4 transition hover:shadow-lg">
        {complaint.image_url && (
          <div className="sm:w-40 sm:flex-shrink-0 h-32 rounded-xl overflow-hidden bg-gray-200 shadow-inner">
            <img src={complaint.image_url} alt={complaint.title} className="w-full h-full object-cover" loading="lazy" />
          </div>
        )}
        <div className="flex-1 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-gray-500 uppercase">#{complaint.case_number}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 px-2 py-0.5 bg-gray-200 rounded-full">{t(`categories.${complaint.category}`)}</span>
              </div>
              <StatusBadge status={complaint.status} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 leading-snug">{complaint.title}</h3>
            <p className="text-xs text-gray-600 line-clamp-2 mt-1.5">{complaint.description}</p>
          </div>
          <div className="border-t border-gray-200 pt-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
              <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="truncate">
                  {complaint.latitude && complaint.longitude
                    ? `${complaint.latitude.toFixed(2)}, ${complaint.longitude.toFixed(2)}`
                    : t('complaints.noLocation')}
                </span>
              </div>
              <span className="font-mono text-[10px] text-gray-400 shrink-0 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(complaint.created_at)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-gray-500">{complaint.profiles?.name || t('complaints.anonymous')}</span>
              <span className="text-xs font-semibold text-gray-500 flex items-center gap-1 group-hover:text-gray-900 transition-colors">
                {t('complaints.viewDetails')} <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
