import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Complaint } from '../types'
import ComplaintCard from '../components/ComplaintCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'
import { getComplaints } from '../services/complaints'

export default function Dashboard() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState<(Complaint & { profiles?: { name: string } | null })[]>([])
  const [loading, setLoading] = useState(true)

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

  const userComplaints = complaints.filter((c) => c.user_id === user?.id)
  const activeComplaints = userComplaints.filter(
    (c) => c.status !== 'resolved'
  )
  const resolvedComplaints = userComplaints.filter(
    (c) => c.status === 'resolved'
  )

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name}
        </h1>
        <p className="mt-2 text-gray-600">Track your reported issues</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-3xl font-bold text-emerald-600">{userComplaints.length}</p>
          <p className="mt-1 text-sm text-gray-600">Total Reports</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-3xl font-bold text-yellow-600">{activeComplaints.length}</p>
          <p className="mt-1 text-sm text-gray-600">Active</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-3xl font-bold text-green-600">{resolvedComplaints.length}</p>
          <p className="mt-1 text-sm text-gray-600">Resolved</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <Link
          to="/report"
          className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Report New Issue
        </Link>
        <Link
          to="/complaints"
          className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          View All Complaints
        </Link>
      </div>

      {userComplaints.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-16 text-center">
          <span className="text-5xl">📝</span>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No reports yet</h3>
          <p className="mt-2 text-gray-600">
            Report your first civic issue to get started.
          </p>
          <Link
            to="/report"
            className="mt-4 inline-block rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Report an Issue
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Complaints</h2>
          {userComplaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </div>
      )}
    </div>
  )
}
