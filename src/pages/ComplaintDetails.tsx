import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import type { Complaint } from '../types'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import { getComplaint } from '../services/complaints'
import { formatDate } from '../utils'

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

export default function ComplaintDetails() {
  const { id } = useParams()
  const [complaint, setComplaint] = useState<(Complaint & { profiles?: { name: string } | null }) | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    loadComplaint(id)
  }, [id])

  const loadComplaint = async (complaintId: string) => {
    try {
      const data = await getComplaint(complaintId)
      setComplaint(data)
    } catch {
      console.error('Failed to load complaint')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner size="lg" />
  if (!complaint) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <span className="text-5xl">🔍</span>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Complaint not found</h2>
        <Link to="/complaints" className="mt-4 inline-block text-emerald-600 hover:text-emerald-700">
          ← Back to complaints
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link to="/complaints" className="text-sm text-emerald-600 hover:text-emerald-700">
        ← Back to complaints
      </Link>

      <div className="mt-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">{complaint.title}</h1>
          <StatusBadge status={complaint.status} />
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          <span className="font-medium text-gray-700">{complaint.category}</span>
          <span>Reported by {complaint.profiles?.name || 'Anonymous'}</span>
          <span>{formatDate(complaint.created_at)}</span>
        </div>
      </div>

      {complaint.image_url && (
        <div className="mt-6 overflow-hidden rounded-xl">
          <img
            src={complaint.image_url}
            alt={complaint.title}
            className="max-h-96 w-full object-cover"
          />
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900">Description</h2>
        <p className="mt-2 text-gray-700 leading-relaxed">{complaint.description}</p>
      </div>

      {complaint.latitude && complaint.longitude && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Location</h2>
          <div className="h-64 rounded-xl overflow-hidden border border-gray-200">
            <MapContainer
              center={[complaint.latitude, complaint.longitude]}
              zoom={15}
              className="h-full w-full"
              zoomControl={true}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[complaint.latitude, complaint.longitude]}
                icon={icon}
              />
            </MapContainer>
          </div>
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 pt-6">
        <h2 className="text-lg font-semibold text-gray-900">Status History</h2>
        <div className="mt-4 space-y-3">
          <StatusTimeline status={complaint.status} created={complaint.created_at} updated={complaint.updated_at} />
        </div>
      </div>
    </div>
  )
}

function StatusTimeline({ status, created, updated }: { status: string; created: string; updated: string }) {
  const steps = [
    { key: 'submitted', label: 'Submitted', time: created },
    { key: 'under_review', label: 'Under Review', time: status === 'under_review' || status === 'in_progress' || status === 'resolved' ? updated : null },
    { key: 'in_progress', label: 'In Progress', time: status === 'in_progress' || status === 'resolved' ? updated : null },
    { key: 'resolved', label: 'Resolved', time: status === 'resolved' ? updated : null },
  ]

  const currentIndex = steps.findIndex((s) => s.key === status)

  return (
    <div className="space-y-4">
      {steps.map((step, i) => {
        const isActive = i <= currentIndex
        const isLast = i === steps.length - 1
        return (
          <div key={step.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i + 1}
              </div>
              {!isLast && (
                <div
                  className={`mt-1 w-0.5 flex-1 ${
                    i < currentIndex ? 'bg-emerald-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
            <div className="pb-4">
              <p
                className={`font-medium ${
                  isActive ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {step.label}
              </p>
              {step.time && (
                <p className="text-sm text-gray-500">{formatDate(step.time)}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
