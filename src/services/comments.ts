import { getSupabase, isSupabaseConfigured } from '../lib/supabase'
import type { Comment } from '../types'

async function getClient() {
  if (!isSupabaseConfigured) return null
  return getSupabase()
}

export async function getComments(complaintId: string) {
  const supabase = await getClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles(name)')
    .eq('complaint_id', complaintId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as (Comment & { profiles: { name: string } | null })[]
}

export async function createComment(complaintId: string, message: string) {
  const supabase = await getClient()
  if (!supabase) throw new Error('Supabase not configured')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('comments')
    .insert({ complaint_id: complaintId, user_id: user.id, message })
    .select('*, profiles(name)')
    .single()

  if (error) throw error
  return data as Comment & { profiles: { name: string } | null }
}
