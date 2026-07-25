import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  AlertCircle, CheckCircle2, Clock, FileText, Filter, MessageSquare,
  X, Search, ArrowUpDown, Building2, MapPin, Calendar, User,
} from 'lucide-react'
import type { Complaint, ComplaintStatus, Authority, ComplaintAction } from '../types'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'
import { getComplaintsByAuthority, updateComplaintStatus, getComplaintActions } from '../services/complaints'
import { getAuthority } from '../services/authorities'
import { formatDate, statusLabels } from '../utils'

export default function Admin() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [authority, setAuthority] = useState<Authority | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<'created_at' | 'case_number' | 'status'>('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  // Detail modal
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [actions, setActions] = useState<ComplaintAction[]>([])
  const [loadingActions, setLoadingActions] = useState(false)
  const [updateNotes, setUpdateNotes] = useState('')
  const [updateStatus, setUpdateStatus] = useState<ComplaintStatus | ''>('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (user?.authority_id) loadData(user.authority_id)
    else setLoading(false)
  }, [user])

  const loadData = async (authorityId: string) => {
    try {
      const [complaintsData, authorityData] = await Promise.all([
        getComplaintsByAuthority(authorityId),
        getAuthority(authorityId),
      ])
      setComplaints(complaintsData)
      setAuthority(authorityData)
    } catch {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const openDetail = async (complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setUpdateNotes('')
    setUpdateStatus('')
    setLoadingActions(true)
    try {
      const data = await getComplaintActions(complaint.id)
      setActions(data)
    } catch {
      setActions([])
    } finally {
      setLoadingActions(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!selectedComplaint || !updateStatus) return
    setUpdating(true)
    try {
      await updateComplaintStatus(selectedComplaint.id, updateStatus as ComplaintStatus, updateNotes || undefined)
      toast.success(`Status updated to ${statusLabels[updateStatus as ComplaintStatus]}`)
      if (user?.authority_id) loadData(user.authority_id)
      // Refresh actions
      const data = await getComplaintActions(selectedComplaint.id)
      setActions(data)
      setSelectedComplaint(prev => prev ? { ...prev, status: updateStatus as ComplaintStatus, resolution_notes: updateNotes || prev.resolution_notes } : null)
      setUpdateStatus('')
      setUpdateNotes('')
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  // Filter + search + sort
  const filtered = complaints
    .filter(c => filterStatus === 'all' || c.status === filterStatus)
    .filter(c =>
      !searchQuery ||
      c.case_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1
      if (sortField === 'created_at') return mul * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      if (sortField === 'case_number') return mul * a.case_number.localeCompare(b.case_number)
      return mul * a.status.localeCompare(b.status)
    })

  if (loading) return <LoadingSpinner size="lg" />

  if (!authority) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900">No Authority Assigned</h2>
        <p className="mt-2 text-gray-600">
          Your account is not linked to any authority. Contact an admin to set your authority_id.
        </p>
      </div>
    )
  }

  const stats = {
    total: complaints.length,
    submitted: complaints.filter(c => c.status === 'submitted').length,
    inProgress: complaints.filter(c => c.status === 'in_progress' || c.status === 'under_review').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  }

  const nextStatuses: Record<ComplaintStatus, ComplaintStatus[]> = {
    submitted: ['under_review', 'in_progress', 'resolved'],
    under_review: ['in_progress', 'resolved'],
    in_progress: ['resolved'],
    resolved: ['in_progress'],
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100">
              <Building2 className="h-7 w-7 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{authority.name}</h1>
              <p className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium uppercase">
                  {authority.type.replace('_', ' ')}
                </span>
                {authority.jurisdiction && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {authority.jurisdiction}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            {user?.name}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Total', value: stats.total, icon: FileText, color: 'text-gray-600', bg: 'bg-gray-100' },
          { label: 'New', value: stats.submitted, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100' },
          { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{s.value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="h-4 w-4 flex-shrink-0 text-gray-500" />
          {['all', 'submitted', 'under_review', 'in_progress', 'resolved'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition ${
                filterStatus === s ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? 'All' : statusLabels[s as ComplaintStatus]}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text" placeholder="Search complaints..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Complaints Table */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-16 text-center">
          <FileText className="mx-auto h-10 w-10 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No complaints</h3>
          <p className="mt-1 text-gray-600">
            {searchQuery ? 'No matches for your search.' :
             filterStatus !== 'all' ? 'No complaints with this status.' :
             'No complaints assigned to your authority yet.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { key: 'case_number', label: 'Case' },
                  { key: null, label: 'Complaint' },
                  { key: null, label: 'Category' },
                  { key: 'status', label: 'Status' },
                  { key: 'created_at', label: 'Date' },
                  { key: null, label: '' },
                ].map(col => (
                  <th key={col.label}
                    onClick={col.key ? () => toggleSort(col.key as typeof sortField) : undefined}
                    className={`px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 tracking-wider ${
                      col.key ? 'cursor-pointer hover:text-gray-700 select-none' : ''
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.key === sortField && <ArrowUpDown className="h-3 w-3" />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filtered.map(complaint => (
                <tr key={complaint.id} className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => openDetail(complaint)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-xs font-medium text-emerald-600">
                      {complaint.case_number}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{complaint.title}</p>
                    <p className="mt-0.5 text-sm text-gray-500 line-clamp-1 max-w-xs">{complaint.description}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{complaint.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={complaint.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(complaint.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm text-emerald-600 font-medium opacity-0 group-hover:opacity-100">
                      View →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-12"
          onClick={e => { if (e.target === e.currentTarget) setSelectedComplaint(null) }}
        >
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 font-mono text-xs font-medium text-emerald-700">
                  {selectedComplaint.case_number}
                </span>
                <StatusBadge status={selectedComplaint.status} />
              </div>
              <button onClick={() => setSelectedComplaint(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Title & Meta */}
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedComplaint.title}</h2>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{selectedComplaint.profiles?.name || 'Anonymous'}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(selectedComplaint.created_at)}</span>
                  <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" />{selectedComplaint.category}</span>
                  {selectedComplaint.authorities && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      {selectedComplaint.authorities.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Description</h3>
                <p className="mt-1 text-gray-600 leading-relaxed">{selectedComplaint.description}</p>
              </div>

              {/* Image */}
              {selectedComplaint.image_url && (
                <img src={selectedComplaint.image_url} alt={selectedComplaint.title}
                  className="max-h-64 w-full rounded-xl object-cover" />
              )}

              {/* Resolution Notes */}
              {selectedComplaint.resolution_notes && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                  <h3 className="text-sm font-semibold text-emerald-800">Resolution Notes</h3>
                  <p className="mt-1 text-sm text-emerald-700">{selectedComplaint.resolution_notes}</p>
                </div>
              )}

              {/* Status Update Form */}
              {selectedComplaint.status !== 'resolved' && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Update Status</h3>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <select value={updateStatus} onChange={e => setUpdateStatus(e.target.value as ComplaintStatus)}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="">Select new status...</option>
                      {nextStatuses[selectedComplaint.status].map(s => (
                        <option key={s} value={s}>{statusLabels[s]}</option>
                      ))}
                    </select>
                    <input type="text" placeholder="Add notes (optional)"
                      value={updateNotes} onChange={e => setUpdateNotes(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button onClick={handleStatusUpdate} disabled={!updateStatus || updating}
                      className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition"
                    >
                      {updating ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                </div>
              )}

              {/* Action History */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Activity Log
                </h3>
                {loadingActions ? (
                  <LoadingSpinner size="sm" />
                ) : actions.length === 0 ? (
                  <p className="text-sm text-gray-500">No activity recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {actions.map(action => (
                      <div key={action.id} className="flex gap-3 text-sm">
                        <div className="flex flex-col items-center">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                            <MessageSquare className="h-3 w-3 text-emerald-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900">
                            <span className="font-medium">{action.profiles?.name || 'Officer'}</span>
                            {' changed status from '}
                            <span className="font-medium">{action.from_status ? statusLabels[action.from_status as ComplaintStatus] : 'Submitted'}</span>
                            {' → '}
                            <span className="font-medium">{statusLabels[action.to_status as ComplaintStatus]}</span>
                          </p>
                          {action.notes && <p className="mt-0.5 text-gray-500">{action.notes}</p>}
                          <p className="mt-0.5 text-xs text-gray-400">{formatDate(action.created_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
              <button onClick={() => setSelectedComplaint(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
