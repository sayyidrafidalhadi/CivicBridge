import { getSupabase, isConfigured } from '../lib/supabase'
import type { Complaint, ComplaintStatus } from '../types'

async function getClient() {
  if (!isConfigured) return null
  return getSupabase()
}

export async function getComplaints() {
  const supabase = await getClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('complaints')
    .select('*, profiles(name)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as (Complaint & { profiles: { name: string } | null })[]
}

export async function getComplaint(id: string) {
  const supabase = await getClient()
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('complaints')
    .select('*, profiles(name)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Complaint & { profiles: { name: string } | null }
}

export async function createComplaint(
  complaint: Omit<Complaint, 'id' | 'created_at' | 'updated_at' | 'status'>
) {
  const supabase = await getClient()
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('complaints')
    .insert({
      ...complaint,
      status: 'submitted',
    })
    .select()
    .single()

  if (error) throw error
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
  const supabase = await getClient()
  if (!supabase) throw new Error('Supabase not configured')
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `${fileName}`

  const { data, error } = await supabase.storage
    .from('complaint-images')
    .upload(filePath, file)

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage.from('complaint-images').getPublicUrl(data.path)

  return publicUrl
}
