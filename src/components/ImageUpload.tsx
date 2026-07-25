import { useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void
}

export default function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setPreview(URL.createObjectURL(file))
      onImageSelect(file)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onImageSelect(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Photo Evidence
      </label>
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="h-48 w-full rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 rounded-full bg-red-600 p-1.5 text-white hover:bg-red-700 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="group flex w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 hover:border-emerald-500 hover:bg-emerald-50 transition"
        >
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 group-hover:bg-emerald-100 transition">
              <ImagePlus className="h-6 w-6 text-gray-400 group-hover:text-emerald-600 transition" />
            </div>
            <p className="mt-3 text-sm text-gray-600">Click to upload a photo</p>
            <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 5MB</p>
          </div>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}
