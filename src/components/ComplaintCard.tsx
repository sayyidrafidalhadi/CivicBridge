import { Link } from 'react-router-dom'
import { ChevronRight, Building2 } from 'lucide-react'
import type { Complaint } from '../types'
import StatusBadge from './StatusBadge'
import { formatDate } from '../utils'

interface ComplaintCardProps {
  complaint: Complaint & { profiles?: { name: string } | null; authorities?: { name: string; type: string } | null }
}

export default function ComplaintCard({ complaint }: ComplaintCardProps) {
  return (
    <Link
      to={`/complaints/${complaint.id}`}
      className="group block rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md hover:border-emerald-200 hover:-translate-y-0.5"
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
              <div>
                <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 font-mono text-xs font-medium text-emerald-700">
                  {complaint.case_number}
                </span>
                <h3 className="mt-1.5 text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition">
                  {complaint.title}
                </h3>
              </div>
              <StatusBadge status={complaint.status} />
            </div>
            <p className="mt-1.5 text-sm text-gray-600 line-clamp-2">
              {complaint.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                {complaint.category}
              </span>
              {complaint.authorities && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  <Building2 className="h-3 w-3" />
                  {complaint.authorities.name}
                </span>
              )}
              {complaint.latitude && complaint.longitude && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  📍 {complaint.latitude.toFixed(2)}, {complaint.longitude.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
            <span>{complaint.profiles?.name || 'Anonymous'}</span>
            <span className="flex items-center gap-1">
              {formatDate(complaint.created_at)}
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
