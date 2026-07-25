import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ClipboardList, Search, MapIcon, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Complaint } from '../types'
import ComplaintCard from '../components/ComplaintCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { getComplaints } from '../services/complaints'

const STATUSES = ['all', 'submitted', 'under_review', 'in_progress', 'resolved']
const PAGE_SIZE = 20

export default function Complaints() {
  const { t } = useTranslation()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const loadComplaints = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getComplaints(page, PAGE_SIZE)
      setComplaints(result.data)
      setTotal(result.count)
    } catch { console.error('Failed to load complaints') }
    finally { setLoading(false) }
  }, [page])

  useEffect(() => { loadComplaints() }, [loadComplaints])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const filtered = complaints.filter(c =>
    (filterStatus === 'all' || c.status === filterStatus) &&
    (!searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.case_number.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="neo-card p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-black text-white">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">{t('complaints.title')}</h1>
            <p className="text-xs font-medium text-gray-500 mt-1">{t('complaints.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-xl px-4 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition ${
                filterStatus === s
                  ? 'neo-btn-primary text-white shadow-sm'
                  : 'neo-badge text-gray-700'
              }`}>
              {s === 'all' ? t('complaints.all') : t(`status.${s}`)}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder={t('admin.search')} value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1) }}
              className="w-full sm:w-56 neo-input rounded-xl py-2 pl-9 pr-3 text-xs font-medium text-gray-900 outline-none" />
          </div>
          <Link to="/map"
            className="inline-flex items-center gap-1.5 rounded-xl neo-card-sm px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-700">
            <MapIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="neo-card p-8 sm:p-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
            <ClipboardList className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">{t('complaints.noComplaints')}</h3>
          <p className="mt-2 text-gray-600">
            {searchQuery ? t('admin.noComplaintsSearch') : filterStatus === 'all' ? t('complaints.noComplaintsAll') : t('complaints.noComplaintsStatus')}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {filtered.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="rounded-xl neo-card-sm px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-700 disabled:opacity-50">
                {t('complaints.prev')}
              </button>
              <span className="text-sm font-bold text-gray-700 px-3">
                {t('complaints.pageOf', { page, total: totalPages })}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="rounded-xl neo-card-sm px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-700 disabled:opacity-50">
                {t('complaints.next')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
