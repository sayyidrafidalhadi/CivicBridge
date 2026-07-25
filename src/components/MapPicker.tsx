import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import { useTranslation } from 'react-i18next'
import { Navigation } from 'lucide-react'
import L from 'leaflet'

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void
}

function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({ click(e) { onLocationSelect(e.latlng.lat, e.latlng.lng) } })
  return null
}

function SetViewOnLocation({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => { map.setView([lat, lng], 15) }, [lat, lng, map])
  return null
}

export default function MapPicker({ onLocationSelect }: MapPickerProps) {
  const { t } = useTranslation()
  const [position, setPosition] = useState<[number, number] | null>(null)
  const [gettingLocation, setGettingLocation] = useState(false)

  const getLocation = () => {
    setGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setPosition([latitude, longitude])
        onLocationSelect(latitude, longitude)
        setGettingLocation(false)
      },
      () => { setGettingLocation(false); setPosition([20.5937, 78.9629]) }
    )
  }

  const handleClick = (lat: number, lng: number) => {
    setPosition([lat, lng])
    onLocationSelect(lat, lng)
  }

  return (
    <div>
      <div className="space-y-2">
        <button type="button" onClick={getLocation} disabled={gettingLocation}
          className="inline-flex items-center gap-2 neo-btn-primary text-white px-4 py-2 text-xs font-bold uppercase tracking-wider disabled:opacity-50">
          <Navigation className={`h-4 w-4 ${gettingLocation ? 'animate-spin' : ''}`} />
          {gettingLocation ? t('report.gettingLocation') : t('report.useMyLocation')}
        </button>
        <div className="h-64 rounded-xl overflow-hidden border border-gray-200">
          <MapContainer center={position || [20.5937, 78.9629]} zoom={5} className="h-full w-full" zoomControl={true}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker onLocationSelect={handleClick} />
            {position && <><Marker position={position} icon={icon} /><SetViewOnLocation lat={position[0]} lng={position[1]} /></>}
          </MapContainer>
        </div>
        {position && (
          <p className="text-xs text-gray-500 font-mono">Lat: {position[0].toFixed(4)}, Lng: {position[1].toFixed(4)}</p>
        )}
      </div>
    </div>
  )
}
