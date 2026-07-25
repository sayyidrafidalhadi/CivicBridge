import { useState } from 'react'
import { X, ZoomIn } from 'lucide-react'

interface ImageLightboxProps {
  src: string
  alt: string
  open: boolean
  onClose: () => void
}

function LightboxModal({ src, alt, open, onClose }: ImageLightboxProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <button onClick={onClose}
        className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition">
        <X className="h-6 w-6" />
      </button>
      <img src={src} alt={alt} className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()} />
    </div>
  )
}

export default function ImageWithLightbox({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className={`group relative ${className || ''}`}>
        <img src={src} alt={alt} className="w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition rounded-xl">
          <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition" />
        </div>
      </button>
      <LightboxModal src={src} alt={alt} open={open} onClose={() => setOpen(false)} />
    </>
  )
}
