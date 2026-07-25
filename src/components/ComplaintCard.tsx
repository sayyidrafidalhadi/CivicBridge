import { Link } from 'react-router-dom'
import type { Complaint } from '../types'
import StatusBadge from './StatusBadge'
import { formatDate } from '../utils'

interface ComplaintCardProps {
  complaint: Complaint & { profiles?: { name: string } | null }
}

export default function ComplaintCard({ complaint }: ComplaintCardProps) {
  return (
    <Link
      to={`/complaints/${complaint.id}`}
      className="group block rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md hover:border-emerald-200"
    >
      <div className="flex flex-col sm:flex-row">
        {complaint.image_url && (
          <div className="sm:w-48 sm:flex-shrink-0">
            <img
              src={complaint.image_url}
              alt={complaint.title}
              className="h-48 w-full rounded-t-xl object-cover sm:rounded-l-xl sm:rounded-tr-none"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600">
                {complaint.title}
              </h3>
              <StatusBadge status={complaint.status} />
            </div>
            <p className="mt-1.5 text-sm text-gray-600 line-clamp-2">
              {complaint.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                {complaint.category}
              </span>
              {complaint.latitude && complaint.longitude && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  📍 {complaint.latitude.toFixed(2)}, {complaint.longitude.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
            <span>{complaint.profiles?.name || 'Anonymous'}</span>
            <span>{formatDate(complaint.created_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
