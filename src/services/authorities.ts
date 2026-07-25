import { getSupabase, isSupabaseConfigured } from '../lib/supabase'
import type { Authority } from '../types'

export async function getAuthorities() {
  if (!isSupabaseConfigured) return []
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('authorities')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data as Authority[]
}

export async function getAuthority(id: string) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('authorities')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Authority
}


