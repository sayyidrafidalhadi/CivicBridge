import { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import {
  AlertCircle, CheckCircle2, Clock, FileText, Filter,
  X, Search, Building2, Calendar, User, BarChart3,
  ShieldAlert, Eye
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import type { Complaint, ComplaintStatus, Authority, ComplaintAction } from '../types'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'
import { useRealtimeComplaints } from '../hooks/useRealtime'
import { getAllComplaints, updateComplaintStatus, getComplaintActions } from '../services/complaints'
import { getAuthorities } from '../services/authorities'
import { formatDate } from '../utils'

const STATUSES = ['all', 'submitted', 'under_review', 'in_progress', 'resolved']
const AUTH_TYPES = ['all', 'mla', 'mp', 'ward_member', 'panchayat', 'municipality', 'corporation', 'water_authority', 'electricity_board', 'other'] as const
const PIE_COLORS = ['#111827', '#374151', '#6b7280', '#9ca3af']

export default function Admin() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [complaints, setComplaints] = useState<(Complaint & { profiles: { name: string } | null; authorities: { name: string; type: string } | null })[]>([])
  const [authorities, setAuthorities] = useState<Authority[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterAuthority, setFilterAuthority] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [actions, setActions] = useState<ComplaintAction[]>([])
  const [loadingActions, setLoadingActions] = useState(false)
  const [updateNotes, setUpdateNotes] = useState('')
  const [updateStatus, setUpdateStatus] = useState<ComplaintStatus | ''>('')
  const [updating, setUpdating] = useState(false)
  const [expandedAuth, setExpandedAuth] = useState<string | null>(null)

  useEffect(() => { loadData() }, [])
  useRealtimeComplaints(() => loadData())

  const loadData = async () => {
    try {
      const [complaintsData, authoritiesData] = await Promise.all([getAllComplaints(), getAuthorities()])
      setComplaints(complaintsData); setAuthorities(authoritiesData)
    } catch { toast.error(t('admin.loadError')) }
    finally { setLoading(false) }
  }

  const openDetail = async (complaint: Complaint) => {
    setSelectedComplaint(complaint); setUpdateNotes(''); setUpdateStatus(''); setLoadingActions(true)
    try { setActions(await getComplaintActions(complaint.id)) }
    catch { setActions([]) }
    finally { setLoadingActions(false) }
  }

  const handleUpdate = async () => {
    if (!selectedComplaint || !updateStatus) return
    setUpdating(true)
    try {
      await updateComplaintStatus(selectedComplaint.id, updateStatus as ComplaintStatus, updateNotes || undefined)
      toast.success(t('admin.update') + ' ✓')
      loadData()
      setSelectedComplaint(prev => prev ? { ...prev, status: updateStatus as ComplaintStatus, resolution_notes: updateNotes || prev.resolution_notes } : null)
      setUpdateStatus(''); setUpdateNotes('')
    } catch { toast.error(t('admin.updateError')) }
    finally { setUpdating(false) }
  }

  if (loading) return <LoadingSpinner size="lg" />

  const authTypeComplaints = useMemo(() => {
    const map = new Map<string, typeof complaints>()
    AUTH_TYPES.filter(a => a !== 'all').forEach(a => map.set(a, []))
    complaints.forEach(c => {
      const type = c.authorities?.type || 'other'
      const existing = map.get(type) || []
      existing.push(c)
      map.set(type, existing)
    })
    return map
  }, [complaints])

  const stats = useMemo(() => {
    const labels = ['mla', 'mp', 'ward_member', 'panchayat', 'municipality', 'corporation', 'water_authority', 'electricity_board', 'other'] as const
    return labels.map(type => {
      const list = authTypeComplaints.get(type) || []
      return { type, total: list.length, new: list.filter(c => c.status === 'submitted').length, active: list.filter(c => c.status !== 'resolved').length, resolved: list.filter(c => c.status === 'resolved').length }
    })
  }, [authTypeComplaints])

  const totalStats = [
    { label: t('admin.total'), value: complaints.length, icon: FileText },
    { label: t('admin.new'), value: complaints.filter(c => c.status === 'submitted').length, icon: AlertCircle },
    { label: t('admin.inProgress'), value: complaints.filter(c => c.status === 'in_progress' || c.status === 'under_review').length, icon: Clock },
    { label: t('admin.resolved'), value: complaints.filter(c => c.status === 'resolved').length, icon: CheckCircle2 },
  ]

  const categoryData = useMemo(() => {
    const map = new Map<string, number>()
    complaints.forEach(c => map.set(c.category, (map.get(c.category) || 0) + 1))
    return Array.from(map.entries()).map(([name, value]) => ({ name: name.length > 12 ? name.slice(0, 12) + '…' : name, value })).sort((a, b) => b.value - a.value)
  }, [complaints])

  const statusData = useMemo(() => {
    const counts = { submitted: 0, under_review: 0, in_progress: 0, resolved: 0 }
    complaints.forEach(c => { counts[c.status]++ })
    return Object.entries(counts).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }))
  }, [complaints])

  const nextStatuses: Record<ComplaintStatus, ComplaintStatus[]> = {
    submitted: ['under_review', 'in_progress', 'resolved'],
    under_review: ['in_progress', 'resolved'],
    in_progress: ['resolved'],
    resolved: ['in_progress'],
  }

  const filtered = complaints
    .filter(c => filterStatus === 'all' || c.status === filterStatus)
    .filter(c => filterAuthority === 'all' || c.authorities?.type === filterAuthority)
    .filter(c => !searchQuery || c.case_number.toLowerCase().includes(searchQuery.toLowerCase()) || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="neo-card p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-black text-white">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">{t('admin.dashboard')}</h1>
            <p className="text-xs font-medium text-gray-500 mt-1">{t('admin.manageComplaints', { name: authorities.length + ' authorities' })}</p>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 grid-cols-2 sm:grid-cols-4">
        {totalStats.map(s => (
          <div key={s.label} className="neo-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{s.label}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{s.value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-200">
                <s.icon className="h-5 w-5 text-gray-900" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map(s => (
          <button key={s.type} onClick={() => setExpandedAuth(expandedAuth === s.type ? null : s.type)}
            className={`neo-card p-4 text-left transition ${expandedAuth === s.type ? 'ring-2 ring-gray-900' : ''}`}>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-gray-700 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 truncate">{t(`authority.${s.type}`)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-gray-900">{s.total} total</span>
              <div className="flex gap-2 text-[10px] font-semibold text-gray-500">
                <span>{s.new} new</span>
                <span>{s.active} active</span>
                <span>{s.resolved} resolved</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {expandedAuth && (
        <div className="mb-8 neo-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {t(`authority.${expandedAuth}`)} — {authTypeComplaints.get(expandedAuth)?.length || 0} complaints
            </h3>
            <button onClick={() => setExpandedAuth(null)} className="p-1 rounded-lg hover:bg-gray-200 transition">
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {(authTypeComplaints.get(expandedAuth) || []).slice(0, 20).map(c => (
              <div key={c.id} onClick={() => openDetail(c)}
                className="flex items-center justify-between gap-3 p-3 neo-card-sm cursor-pointer">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-gray-500">#{c.case_number}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 truncate mt-0.5">{c.title}</p>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">{formatDate(c.created_at)}</span>
              </div>
            ))}
            {(authTypeComplaints.get(expandedAuth) || []).length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">{t('admin.noComplaints')}</p>
            )}
          </div>
        </div>
      )}

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="neo-card p-5">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> {t('admin.byCategory')}
          </h3>
          {categoryData.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#374151" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <p className="text-sm text-gray-400 text-center py-8">{t('admin.noData')}</p>}
        </div>

        <div className="neo-card p-5">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> {t('admin.byStatus')}
          </h3>
          {statusData.length > 0 ? (
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}>
                    {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : <p className="text-sm text-gray-400 text-center py-8">{t('admin.noData')}</p>}
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="h-4 w-4 flex-shrink-0 text-gray-500" />
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`rounded-xl px-4 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition ${filterStatus === s ? 'neo-btn-primary text-white shadow-sm' : 'neo-badge text-gray-700'}`}>
              {s === 'all' ? t('complaints.all') : t(`status.${s}`)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder={t('admin.search')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full sm:w-56 neo-input rounded-xl py-2 pl-9 pr-3 text-xs font-medium text-gray-900 outline-none" />
          </div>
          <select value={filterAuthority} onChange={e => setFilterAuthority(e.target.value)}
            className="neo-input rounded-xl px-3 py-2 text-xs font-medium text-gray-900 outline-none">
            <option value="all">{t('complaints.all')} Authorities</option>
            {AUTH_TYPES.filter(a => a !== 'all').map(a => <option key={a} value={a}>{t(`authority.${a}`)}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="neo-card p-8 sm:p-16 text-center">
          <FileText className="mx-auto h-10 w-10 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">{t('admin.noComplaints')}</h3>
          <p className="mt-1 text-gray-600">{searchQuery ? t('admin.noComplaintsSearch') : filterStatus !== 'all' ? t('complaints.noComplaintsStatus') : t('admin.noComplaintsAll')}</p>
        </div>
      ) : (
        <div className="neo-card rounded-3xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-100/50">
            <h2 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider">{t('admin.complaintRegistry')} ({filtered.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-100 text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
                  <th className="py-3 px-6">{t('admin.case')}</th>
                  <th className="py-3 px-4">{t('admin.complaint')}</th>
                  <th className="py-3 px-4">{t('admin.category')}</th>
                  <th className="py-3 px-4">{t('admin.status')}</th>
                  <th className="py-3 px-4">Authority</th>
                  <th className="py-3 px-4">{t('admin.date')}</th>
                  <th className="py-3 px-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-gray-100">
                {filtered.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-200 transition cursor-pointer" onClick={() => openDetail(complaint)}>
                    <td className="py-3 px-6 font-mono font-bold text-gray-900">#{complaint.case_number}</td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-semibold text-gray-900 truncate">{complaint.title}</p>
                      <p className="text-xs text-gray-500 truncate">{complaint.description}</p>
                    </td>
                    <td className="py-3 px-4"><span className="px-2 py-1 bg-gray-200 rounded text-gray-900 font-semibold text-xs uppercase">{t(`categories.${complaint.category}`)}</span></td>
                    <td className="py-3 px-4"><StatusBadge status={complaint.status} /></td>
                    <td className="py-3 px-4 text-gray-600 text-[10px] font-bold uppercase">{complaint.authorities?.name || '—'}</td>
                    <td className="py-3 px-4 text-gray-600">{formatDate(complaint.created_at)}</td>
                    <td className="py-3 px-6 text-right">
                      <button onClick={(e) => { e.stopPropagation(); openDetail(complaint) }}
                        className="px-3 py-1.5 neo-btn-primary text-white rounded-xl font-bold text-xs flex items-center gap-1 ml-auto">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t('admin.view')}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-12"
            onClick={e => { if (e.target === e.currentTarget) setSelectedComplaint(null) }}>
            <div className="w-full max-w-3xl rounded-3xl neo-card shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className="bg-gray-900 px-6 py-4 flex items-center justify-between border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-gray-700 rounded-xl text-xs font-mono font-bold text-gray-200">#{selectedComplaint.case_number}</span>
                  <StatusBadge status={selectedComplaint.status} />
                </div>
                <button onClick={() => setSelectedComplaint(null)} className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-gray-700 transition">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-6 bg-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedComplaint.title}</h2>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{selectedComplaint.profiles?.name || t('complaints.anonymous')}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(selectedComplaint.created_at)}</span>
                    <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" />{selectedComplaint.authorities?.name || t('complaints.anonymous')}</span>
                  </div>
                </div>

                <div className="neo-card-sm p-4">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t('detail.description')}</h3>
                  <p className="mt-1 text-gray-600 leading-relaxed">{selectedComplaint.description}</p>
                </div>

                {selectedComplaint.image_url && (
                  <img src={selectedComplaint.image_url} alt={selectedComplaint.title} className="max-h-64 w-full rounded-xl object-cover" />
                )}

                {selectedComplaint.resolution_notes && (
                  <div className="bg-gray-200 rounded-2xl p-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t('admin.resolutionNotes')}</h3>
                    <p className="mt-1 text-sm text-gray-700">{selectedComplaint.resolution_notes}</p>
                  </div>
                )}

                {user?.authority_id && selectedComplaint.assigned_to === user.authority_id && selectedComplaint.status !== 'resolved' && (
                  <div className="neo-card-sm p-4">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">{t('admin.updateStatus')}</h3>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <select value={updateStatus} onChange={e => setUpdateStatus(e.target.value as ComplaintStatus)}
                        className="rounded-xl neo-input px-3 py-2 text-xs font-medium text-gray-900 outline-none">
                        <option value="">{t('admin.selectStatus')}</option>
                        {nextStatuses[selectedComplaint.status].map(s => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
                      </select>
                      <input type="text" placeholder={t('admin.addNotes')} value={updateNotes} onChange={e => setUpdateNotes(e.target.value)}
                        className="flex-1 rounded-xl neo-input px-3 py-2 text-xs font-medium text-gray-900 outline-none" />
                      <button onClick={handleUpdate} disabled={!updateStatus || updating}
                        className="rounded-xl neo-btn-primary text-white px-5 py-2 text-xs font-bold uppercase tracking-wider disabled:opacity-50">
                        {updating ? t('admin.updating') : t('admin.update')}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" /> {t('admin.activityLog')}
                  </h3>
                  {loadingActions ? <LoadingSpinner size="sm" /> : actions.length === 0 ? (
                    <p className="text-sm text-gray-500">{t('admin.noActivity')}</p>
                  ) : (
                    <div className="space-y-3">
                      {actions.map(action => (
                        <div key={action.id} className="flex gap-3 text-sm p-3 neo-card-sm">
                          <div className="flex-1">
                            <p className="text-gray-900">{t('admin.statusChanged', {
                              name: action.profiles?.name || 'Officer',
                              from: action.from_status ? t(`status.${action.from_status as ComplaintStatus}`) : t('detail.submitted'),
                              to: t(`status.${action.to_status as ComplaintStatus}`),
                            })}</p>
                            {action.notes && <p className="mt-0.5 text-gray-500">{action.notes}</p>}
                            <p className="mt-0.5 text-xs text-gray-400">{formatDate(action.created_at)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 px-6 py-4 flex justify-end bg-gray-100">
                <button onClick={() => setSelectedComplaint(null)}
                  className="rounded-xl neo-card-sm px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                  {t('admin.close')}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
