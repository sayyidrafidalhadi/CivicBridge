import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PlusCircle, Eye, FileText, AlertCircle, CheckCircle2, ClipboardList, LayoutDashboard } from 'lucide-react'
import type { Complaint } from '../types'
import ComplaintCard from '../components/ComplaintCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'
import { getComplaints } from '../services/complaints'
import { useRealtimeComplaints } from '../hooks/useRealtime'

export default function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)

  const loadComplaints = useCallback(async () => {
    try { const result = await getComplaints(); setComplaints(result.data) }
    catch { console.error('Failed to load complaints') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadComplaints() }, [loadComplaints])
  useRealtimeComplaints(loadComplaints)

  const userComplaints = complaints.filter((c) => c.user_id === user?.id)
  const activeCount = userComplaints.filter((c) => c.status !== 'resolved').length
  const resolvedCount = userComplaints.filter((c) => c.status === 'resolved').length

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="neo-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-black text-white">
            <LayoutDashboard className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
              {t('dashboard.welcome', { name: user?.name })}
            </h1>
            <p className="text-xs font-medium text-gray-500 mt-1">{t('dashboard.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 my-8">
        {[
          { label: t('dashboard.totalReports'), value: userComplaints.length, icon: FileText },
          { label: t('dashboard.active'), value: activeCount, icon: AlertCircle },
          { label: t('dashboard.resolved'), value: resolvedCount, icon: CheckCircle2 },
        ].map(s => (
          <div key={s.label} className="neo-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-200">
                <s.icon className="h-5 w-5 text-gray-900" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-600">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-8">
        <Link to="/report"
          className="inline-flex items-center gap-2 rounded-xl neo-btn-primary text-white px-5 py-2.5 text-sm font-bold uppercase tracking-wider">
          <PlusCircle className="h-4 w-4" /> {t('dashboard.reportNew')}
        </Link>
        <Link to="/complaints"
          className="inline-flex items-center gap-2 rounded-xl neo-card-sm px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-gray-800">
          <Eye className="h-4 w-4" /> {t('dashboard.viewAll')}
        </Link>
      </div>

      {userComplaints.length === 0 ? (
        <div className="neo-card p-8 sm:p-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
            <ClipboardList className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">{t('dashboard.noReports')}</h3>
          <p className="mt-2 text-gray-600">{t('dashboard.noReportsDesc')}</p>
          <Link to="/report"
            className="mt-4 inline-flex items-center gap-2 rounded-xl neo-btn-primary text-white px-5 py-2.5 text-sm font-bold uppercase tracking-wider">
            <PlusCircle className="h-4 w-4" /> {t('dashboard.reportNew')}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">{t('dashboard.yourComplaints')}</h2>
          {userComplaints.map((complaint) => <ComplaintCard key={complaint.id} complaint={complaint} />)}
        </div>
      )}
    </div>
  )
}
