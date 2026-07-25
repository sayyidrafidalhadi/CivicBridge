import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { MapPin, ImagePlus, Send } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'
import MapPicker from '../components/MapPicker'
import LoadingSpinner from '../components/LoadingSpinner'
import { categories } from '../utils'
import { createComplaint, uploadImage } from '../services/complaints'
import { getAuthorities } from '../services/authorities'
import type { Authority } from '../types'

export default function Report() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [loadingAuthorities, setLoadingAuthorities] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [authorities, setAuthorities] = useState<Authority[]>([])
  const [selectedAuthority, setSelectedAuthority] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)

  useEffect(() => {
    loadAuthorities()
  }, [])

  const loadAuthorities = async () => {
    try {
      const data = await getAuthorities()
      setAuthorities(data)
      if (data.length > 0) setSelectedAuthority(data[0].id)
    } catch {
      toast.error('Failed to load authorities')
    } finally {
      setLoadingAuthorities(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAuthority) {
      toast.error('Please select an authority')
      return
    }
    setSubmitting(true)

    try {
      let image_url: string | null = null
      if (imageFile) {
        image_url = await uploadImage(imageFile)
      }

      await createComplaint({
        title,
        description,
        category,
        image_url,
        latitude,
        longitude,
        assigned_to: selectedAuthority,
      })

      toast.success('Complaint submitted successfully!')
      navigate('/complaints')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingAuthorities) return <LoadingSpinner size="lg" />

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Report an Issue</h1>
        <p className="mt-2 text-gray-600">
          Describe the issue and assign it to the relevant authority
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Pothole on Main Street"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Assign To
            </label>
            <select
              required
              value={selectedAuthority}
              onChange={(e) => setSelectedAuthority(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {authorities.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue in detail..."
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <ImageUpload onImageSelect={setImageFile} />

        <MapPicker
          onLocationSelect={(lat, lng) => {
            setLatitude(lat)
            setLongitude(lng)
          }}
        />

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {submitting ? (
            <>Submitting...</>
          ) : (
            <><Send className="h-4 w-4" /> Submit Complaint</>
          )}
        </button>
      </form>
    </div>
  )
}
