import { getSupabase, isSupabaseConfigured, isCloudinaryConfigured, cloudinaryCloudName, cloudinaryUploadPreset } from '../lib/supabase'
import type { Complaint, ComplaintStatus } from '../types'
import { getAuthorityByType } from './authorities'
import { sendComplaintNotification } from './email'

async function getClient() {
  if (!isSupabaseConfigured) return null
  return getSupabase()
}

export async function getComplaints() {
  const supabase = await getClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('complaints')
    .select('*, profiles(name), authorities(name, type)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as (Complaint & { profiles: { name: string } | null; authorities: { name: string; type: string } | null })[]
}

export async function getComplaintsByAuthority(authorityId: string) {
  const supabase = await getClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('complaints')
    .select('*, profiles(name), authorities(name, type)')
    .eq('assigned_to', authorityId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as (Complaint & { profiles: { name: string } | null; authorities: { name: string; type: string } | null })[]
}

export async function getComplaint(id: string) {
  const supabase = await getClient()
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('complaints')
    .select('*, profiles(name), authorities(name, type)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Complaint & { profiles: { name: string } | null; authorities: { name: string; type: string } | null }
}

function generateCaseNumber(): string {
  const year = new Date().getFullYear()
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `CB-${year}-${rand}`
}

export async function createComplaint(
  complaint: Omit<Complaint, 'id' | 'case_number' | 'created_at' | 'updated_at' | 'status' | 'user_id'> & { assigned_to: string }
) {
  const supabase = await getClient()
  if (!supabase) throw new Error('Supabase not configured')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('You must be signed in')

  const caseNumber = generateCaseNumber()

  const { data, error } = await supabase
    .from('complaints')
    .insert({
      ...complaint,
      case_number: caseNumber,
      user_id: user.id,
      status: 'submitted',
    })
    .select('*, authorities(name, type, email)')
    .single()

  if (error) throw error

  // Send email notification to the assigned authority
  const authority = data.authorities as { name: string; type: string; email: string } | null
  if (authority?.email) {
    await sendComplaintNotification(
      authority.email,
      authority.name,
      data.case_number,
      data.title,
      data.description
    )
  }

  return data as Complaint
}

export async function updateComplaintStatus(
  id: string,
  status: ComplaintStatus
) {
  const supabase = await getClient()
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('complaints')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Complaint
}

export async function uploadImage(file: File) {
  if (isCloudinaryConfigured && cloudinaryCloudName && cloudinaryUploadPreset) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', cloudinaryUploadPreset)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
      { method: 'POST', body: formData }
    )

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error?.message || 'Cloudinary upload failed')
    }

    const result = await response.json()
    return result.secure_url
  }

  const supabase = await getClient()
  if (!supabase) throw new Error('No image storage configured')

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('complaint-images')
    .upload(fileName, file)

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage.from('complaint-images').getPublicUrl(data.path)
  return publicUrl
}
