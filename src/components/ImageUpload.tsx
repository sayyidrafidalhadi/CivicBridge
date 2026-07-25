import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImagePlus, X } from 'lucide-react'

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void
}

export default function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const { t } = useTranslation()
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
      {preview ? (
        <div className="relative">
          <img src={preview} alt="Preview" className="h-48 w-full rounded-xl object-cover shadow-inner" />
          <button type="button" onClick={handleRemove}
            className="absolute top-2 right-2 rounded-full bg-black p-1.5 text-white hover:bg-gray-800 transition">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8 hover:border-gray-400 hover:bg-gray-200 transition">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              <ImagePlus className="h-6 w-6 text-gray-500" />
            </div>
            <p className="mt-3 text-sm text-gray-600 font-medium">{t('report.uploadPhoto')}</p>
            <p className="mt-1 text-xs text-gray-500">{t('report.uploadHint')}</p>
          </div>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
    </div>
  )
}
