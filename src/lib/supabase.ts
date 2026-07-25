import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mdorigiyjuxbjtbojwwu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kb3JpZ2l5anV4Ymp0Ym9qd3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5OTM5MTEsImV4cCI6MjEwMDU2OTkxMX0.zj0A-A-hoz1OwYE4sJj7gpsBndLg2RiTLBuqMFAzEpc'

export const isSupabaseConfigured = true

let _supabase: SupabaseClient | null = createClient(supabaseUrl, supabaseAnonKey)

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    throw new Error('Supabase not configured')
  }
  return _supabase
}

// Cloudinary
export const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
export const cloudinaryUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
export const isCloudinaryConfigured = !!(cloudinaryCloudName && cloudinaryUploadPreset)

// EmailJSON
export const emailJsonUrl = import.meta.env.VITE_EMAILJSON_URL
export const isEmailJsonConfigured = !!emailJsonUrl
