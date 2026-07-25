import { useEffect, useState } from 'react'
import type { Complaint } from '../types'
import ComplaintCard from '../components/ComplaintCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { getComplaints } from '../services/complaints'

export default function Complaints() {
  const [complaints, setComplaints] = useState<(Complaint & { profiles?: { name: string } | null })[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    loadComplaints()
  }, [])

  const loadComplaints = async () => {
    try {
      const data = await getComplaints()
      setComplaints(data)
    } catch {
      console.error('Failed to load complaints')
    } finally {
      setLoading(false)
    }
  }

  const filtered = filterStatus === 'all'
    ? complaints
    : complaints.filter((c) => c.status === filterStatus)

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Public Complaints</h1>
        <p className="mt-2 text-gray-600">
          Browse civic issues reported by the community
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
            {s === 'all' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-16 text-center">
          <span className="text-5xl">📋</span>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No complaints found</h3>
          <p className="mt-2 text-gray-600">
            {filterStatus === 'all'
              ? 'No complaints have been reported yet.'
              : 'No complaints with this status.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </div>
      )}
    </div>
  )
}
