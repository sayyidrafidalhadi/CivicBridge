import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import type { Complaint, ComplaintStatus } from '../types'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import { getComplaints, updateComplaintStatus } from '../services/complaints'
import { formatDate, statusLabels } from '../utils'

export default function Admin() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    loadComplaints()
  }, [])

  const loadComplaints = async () => {
    try {
      const data = await getComplaints()
      setComplaints(data)
    } catch {
      toast.error('Failed to load complaints')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, status: ComplaintStatus) => {
    setUpdatingId(id)
    try {
      await updateComplaintStatus(id, status)
      toast.success('Status updated')
      loadComplaints()
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = filterStatus === 'all'
    ? complaints
    : complaints.filter((c) => c.status === filterStatus)

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Officer Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage and update complaint statuses
        </p>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {['all', 'submitted', 'under_review', 'in_progress', 'resolved'].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap ${
              filterStatus === s
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s === 'all' ? 'All' : statusLabels[s as ComplaintStatus]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-16 text-center">
          <span className="text-5xl">📋</span>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No complaints</h3>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filtered.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{complaint.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{complaint.description}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{complaint.category}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={complaint.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(complaint.created_at)}</td>
                  <td className="px-6 py-4">
                    {complaint.status !== 'resolved' && (
                      <select
                        value=""
                        disabled={updatingId === complaint.id}
                        onChange={(e) =>
                          handleUpdateStatus(complaint.id, e.target.value as ComplaintStatus)
                        }
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="" disabled>
                          {updatingId === complaint.id ? 'Updating...' : 'Update status'}
                        </option>
                        {(['submitted', 'under_review', 'in_progress', 'resolved'] as ComplaintStatus[])
                          .filter((s) => s !== complaint.status)
                          .map((s) => (
                            <option key={s} value={s}>
                              {statusLabels[s]}
                            </option>
                          ))}
                      </select>
                    )}
                    {complaint.status === 'resolved' && (
                      <span className="text-sm text-green-600 font-medium">Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
