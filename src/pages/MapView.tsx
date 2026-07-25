import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import { Map as MapIcon } from 'lucide-react'
import type { Complaint } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'
import StatusBadge from '../components/StatusBadge'
import { getComplaints } from '../services/complaints'
import { formatDate } from '../utils'

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41],
})

export default function MapView() {
  const { t } = useTranslation()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getComplaints(1, 200).then(result => {
      setComplaints(result.data.filter(c => c.latitude && c.longitude))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner size="lg" />

  const center: [number, number] = complaints.length > 0
    ? [complaints.reduce((s, c) => s + c.latitude!, 0) / complaints.length, complaints.reduce((s, c) => s + c.longitude!, 0) / complaints.length]
    : [20.5937, 78.9629]

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="neo-card overflow-hidden">
        <div className="p-6 sm:p-8 flex items-center gap-4 text-gray-900">
          <div className="p-3 rounded-2xl bg-black text-white">
            <MapIcon className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">{t('map.title')}</h1>
            <p className="text-xs font-medium text-gray-500 mt-1">{t('map.subtitle', { count: complaints.length })}</p>
          </div>
        </div>
        <div className="h-[70vh] mx-4 mb-4 rounded-2xl overflow-hidden border border-gray-200">
          <MapContainer center={center} zoom={5} className="h-full w-full" zoomControl={true} scrollWheelZoom={true}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {complaints.map((c) => (
              <Marker key={c.id} position={[c.latitude!, c.longitude!]} icon={icon}>
                <Popup>
                  <div className="min-w-[200px]">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-xs font-medium text-gray-900">{c.case_number}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <Link to={`/complaints/${c.id}`} className="font-semibold text-gray-900 hover:text-gray-600 text-sm block mb-1">{c.title}</Link>
                    <p className="text-xs text-gray-500">{t(`categories.${c.category}`)}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(c.created_at)}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        {complaints.length === 0 && <p className="text-center text-gray-400 pb-8">{t('map.noLocations')}</p>}
      </div>
    </div>
  )
}
