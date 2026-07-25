import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

let _supabase: SupabaseClient | null = null

if (isSupabaseConfigured) {
  _supabase = createClient(supabaseUrl!, supabaseAnonKey!)
} else {
  console.warn(
    'Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env'
  )
}

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    throw new Error('Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env')
  }
  return _supabase
}

// Cloudinary config
export const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
export const cloudinaryUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const isCloudinaryConfigured = !!(cloudinaryCloudName && cloudinaryUploadPreset)